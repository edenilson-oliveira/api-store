import { Request,Response } from 'express';
import Seller from '../database/models/seller';
import SendMail from '../services/mail';
import SendSms from '../services/sendSms';
import CodeGenerate from '../services/codeGenerate';
import verifyTokenUser from '../authentication/VerifyToken';
import ValidateSellerAccountInfo from '../services/validateSellerAccountInfo';
import VerifySellerAccount from '../repository/VerifySellerAccountInfo';
import VerifyUserIsSeller from '../repository/VerifyUserIsSeller';
import SellerInfoOnCache from '../repository/SellerInfoOnCache';
import client from '../redisConfig';

class SellerAccountController{
  public async GetInfoSellerAccount(req: Request,res: Response){
    try{
      const verifyToken = verifyTokenUser.execute(req,res)
      const id = verifyToken.userId || 0
        
      if(!verifyToken.auth){
        return
      }
      
      const verifyUserIsSeller = new VerifyUserIsSeller(id)
      
      const verify = await verifyUserIsSeller.execute()
      
      if(verify){
        return res.status(401).json({message: verify})
      }
      
      const sellerInfo = await Seller.findAll({
          where: {
            userId: id
          }
        })
        
      res.status(200).json({sellerInfo})
    }
  
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  
  public async EditInfoAccountSeller(req: Request,res: Response){
    try{
      const verifyToken = verifyTokenUser.execute(req,res)
      const id = verifyToken.userId || 0
          
      if(!verifyToken.auth){
        return
      }
        
      const verifyUserIsSeller = new VerifyUserIsSeller(id)
        
      const verify = await verifyUserIsSeller.execute()
        
      if(verify){
        return res.status(401).json({message: verify})
      }
      
      const sellerInfoOnDb = await Seller.findAll({
          where: {
            userId: id
          }
        })
      const sellerInfo = sellerInfoOnDb[0].dataValues
        
      const sellerInfoDataToEdit = {
        storeName: req.body.name  || sellerInfo.storeName,
        status: req.body.status  || sellerInfo.status,
        category: req.body.category  || sellerInfo.category,
        description: req.body.description  || sellerInfo.description
      }
      
      
      const { storeName,description,category,status } = sellerInfoDataToEdit
      
      const validateInfos = new ValidateSellerAccountInfo()
      
      const validate = validateInfos.validateInfoAboutStore(storeName,description,category,status)
      
      if(validate){
        return res.status(400).json({message: validate})
      }
      
      res.status(200).end()
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  
  public async EditEmailStore(req: Request,res: Response){
    
    const verifyToken = verifyTokenUser.execute(req,res)
    const id = verifyToken.userId || 0
    
    if(!verifyToken.auth){
        return
    }
        
    const verifyUserIsSeller = new VerifyUserIsSeller(id)
        
    const verify = await verifyUserIsSeller.execute()
        
    if(verify){
      return res.status(401).json({message: verify})
    }
      
    const { email } = req.body
      
    const emailIsValide = new ValidateSellerAccountInfo().validateEmail(email)
      
    if(emailIsValide){
        
      const verifySellerAccount = new VerifySellerAccount()
        
      const verifyEmail = await verifySellerAccount.verifyEmailSeller(email)
        
        
      if(verifyEmail){
        return res.status(409).json({message: 'Email already exist'})
      }
        
      const code = new CodeGenerate().execute()
        
      const sendMail = new SendMail(email,'Confirm Email', `
        <h1>Api Store</h1>
        <p>Confirm your email with code ${code} for to edit seller account</p>
        `).execute()
        
      const userSellerEmail = { email, code }
        
      client.set(`user-seller-edit-email-${id}`, JSON.stringify(userSellerEmail))
        
      client.expire(`user-seller-edit-email-${id}`, 60)
        
        
      return res.status(200).json('Confirm your email')
    }
      
    res.status(400).json({message: 'Email is not valid'})
  }
  
  public async confirmEditEmailStore(req: Request,res: Response){
    try{
      const verifyToken = verifyTokenUser.execute(req,res)
      const id = verifyToken.userId || 0
      
      if(!verifyToken.auth){
          return
      }
          
      const verifyUserIsSeller = new VerifyUserIsSeller(id)
          
      const verify = await verifyUserIsSeller.execute()
          
      if(verify){
        return res.status(401).json({message: verify})
      }
        
      const userCode = req.body.code
        
      const userInfo  = await client.get(`user-seller-edit-email-${id}`) || ''
        
      if(!userInfo){
        return res.status(404).end()
      }
        
      const { code, email } = JSON.parse(userInfo)
        
      if(userCode === code){
        
        const sellerInfoOnCache = new SellerInfoOnCache()
        
        sellerInfoOnCache.edit({id,email,phone: ''})
        await Seller.update({emailStore: email},{
          where: {
            id
          }
        })
        
        client.del(`user-seller-edit-email-${id}`)
        
        return res.status(200).json({ message: 'Email edited successfully'})
        
      }
        
      res.status(400).json({message: 'Code is not valid'})
  }
  catch{
    res.status(500).json({message: 'Internal server error'})
  }
  }
  
  public async EditPhone(req: Request,res: Response){
    
    const verifyToken = verifyTokenUser.execute(req,res)
    const id = verifyToken.userId || 0
    
    if(!verifyToken.auth){
        return
    }
        
    const verifyUserIsSeller = new VerifyUserIsSeller(id)
        
    const verify = await verifyUserIsSeller.execute()
        
    if(verify){
      return res.status(401).json({message: verify})
    }
      
    const { phone } = req.body
      
    const phoneIsValide = new ValidateSellerAccountInfo().validatePhone(phone)
      
    if(phoneIsValide){
        
      const verifySellerAccount = new VerifySellerAccount()
        
      const verifyPhone = await verifySellerAccount.verifyPhoneSeller(phone)
        
      if(verifyPhone){
        return res.status(409).json({message: 'Phone already exist'})
      }
        
      const code = new CodeGenerate().execute()
      
      const sendSms = new SendSms(`Confirm your phone number with code ${code}`, phone)
      const send = await sendSms.execute()
        
      if(!send.body){
        return res.status(400).json({message: send})
      }
      
        
      const userSellerPhone = { phone, code }
        
      client.set(`user-seller-edit-phone-${id}`, JSON.stringify(userSellerPhone))
        
      client.expire(`user-seller-edit-phone-${id}`, 60)
        
        
      return res.status(200).json('Confirm your phone number')
    }
      
    res.status(400).json({message: 'phone is not valid'})
  }
  
  public async confirmEditPhone(req: Request,res: Response){
    try{
      const verifyToken = verifyTokenUser.execute(req,res)
      const id = verifyToken.userId || 0
      
      if(!verifyToken.auth){
          return
      }
          
      const verifyUserIsSeller = new VerifyUserIsSeller(id)
          
      const verify = await verifyUserIsSeller.execute()
          
      if(verify){
        return res.status(401).json({message: verify})
      }
        
      const userCode = req.body.code
        
      const userInfo  = await client.get(`user-seller-edit-phone-${id}`) || ''
        
      if(!userInfo){
        return res.status(404).end()
      }
        
      const { code, phone } = JSON.parse(userInfo)
        
      if(userCode === code){
        
        const sellerInfoOnCache = new SellerInfoOnCache()
        
        sellerInfoOnCache.edit({id,email: '',phone})
        await Seller.update({phone},{
          where: {
            id
          }
        })
        
        client.del(`user-seller-edit-phone-${id}`)
        
        return res.status(200).json({ message: 'Phone number edited successfully'})
        
      }
        
      res.status(400).json({message: 'Code is not valid'})
  }
  catch{
    res.status(500).json({message: 'Internal server error'})
  }
  }
  
}

export default new SellerAccountController