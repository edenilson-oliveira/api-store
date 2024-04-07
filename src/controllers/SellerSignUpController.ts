import { Request,Response,NextFunction } from 'express';
import Seller from '../database/models/seller';
import verifyTokenUser from '../authentication/VerifyToken';
import SendMail from '../services/mail';
import SendSms from '../services/sendSms';
import CodeGenerate from '../services/codeGenerate';
import ValidateSellerAccountInfo from '../services/validateSellerAccountInfo';
import VerifySellerAccount from '../repository/VerifySellerAccountInfo';
import SellerInfoOnCache from '../repository/SellerInfoOnCache';
import client from '../redisConfig';

class SellerAccountController{
  public async AddEmailStore(req: Request,res: Response){
    try{
      
      const verifyToken = verifyTokenUser.execute(req,res)
      const id = verifyToken.userId
      
      if(!verifyToken.auth){
        return
      }
      
      const { email } = req.body
        
      const validateEmail = /^[a-z0-9/./_/-]+@[a-z]+(\.[a-z]+){1,}$/
      
      const emailIsValide = validateEmail.exec(email)
      
      if(emailIsValide){
        const sellerEmail = await Seller.findAll({
          where: {
            emailStore: email
          }
        })
        
        if(sellerEmail.length > 0){
          return res.status(409).json({message: 'Email already exist'})
        }
        
        const code = new CodeGenerate().execute()
        
        const sendMail = new SendMail(email,'Confirm Email', `
        <h1>Api Store</h1>
        <p>Confirm your email with code ${code} for to create seller account</p>
        `).execute()
        
        const userSellerEmail = { email, code }
        
        client.set(`user-seller-email-${id}`, JSON.stringify(userSellerEmail))
        
        client.expire(`user-seller-email-${id}`, 60)
        
        
        return res.status(200).json('Confirm your email')
      }
      
      res.status(400).json({message: 'Email is not valid'})
    }
  catch{
    res.status(500).json({message: 'Internal server error'})
    }
  }
  
  public async confirmEmailSeller(req: Request,res: Response){
    const verifyToken = verifyTokenUser.execute(req,res)
    const id = verifyToken.userId
      
    if(!verifyToken.auth){
      return
    }
      
    const userCode = req.body.code
      
    const userInfo  = await client.get(`user-seller-email-${id}`) || ''
      
    if(!userInfo){
      return res.status(404).end()
    }
      
    const { code, email } = JSON.parse(userInfo)
      
    if(userCode === code){
      const userContact  = await client.get(`user-seller-contact-${id}`) || ''
      
      const usersellerContact = { email, phone: userContact ? JSON.parse(userContact).phone: ''} 
      
      client.set(`user-seller-contact-${id}`, JSON.stringify(usersellerContact))
      client.expire(`user-seller-contact-${id}`, 60 * 60 * 24)
      client.del(`user-seller-email-${id}`)
      
      return res.status(200).json({ message: 'Email confirmed successfully'})
    }
      
    res.status(400).json({message: 'Code is not valid'})
  }
  
  public async AddPhoneStore(req: Request,res: Response){
    try{
      const verifyToken = verifyTokenUser.execute(req,res)
      const id = verifyToken.userId
      
      if(!verifyToken.auth){
        return
      }
      
      const { phone } = req.body
      const validatePhone = /[+]{1}[0-9]{13}$/
      
      const phoneIsValide = validatePhone.exec(phone)
      
      if(phoneIsValide){
        const sellerPhone = await Seller.findAll({
          where: {
            phone
          }
        })
        
        if(sellerPhone.length > 0){
          return res.status(409).json({message: 'Phone number already exist'})
        }
        
        const code = new CodeGenerate().execute()
        
        const userSellerPhone = { phone, code }
        
        const sendSms = new SendSms(`Confirm your phone number with code ${code}`, phone)
        const send = await sendSms.execute()
        
        if(!send.body){
          return res.status(400).json({message: send})
        }
        
        client.set(`user-seller-phone-${id}`, JSON.stringify(userSellerPhone))
        
        client.expire(`user-seller-phone-${id}`, 60)
        
        return res.status(200).json('Confirm your phone number')
      }
      
      res.status(400).json({message: 'Phone number is not valid'})
    }
    catch(err){
      console.log(err)
      res.status(500).json({message: 'Internal server error'})
    }
  }
  
  public async confirmPhoneSeller(req: Request,res: Response){
    const verifyToken = verifyTokenUser.execute(req,res)
    const id = verifyToken.userId
      
    if(!verifyToken.auth){
      return
    }
      
    const userCode = req.body.code
      
    const userInfo  = await client.get(`user-seller-phone-${id}`) || ''
      
    if(!userInfo){
      return res.status(404).end()
    }
      
    const { code, phone } = JSON.parse(userInfo)
      
    if(userCode === code){
      const userContact  = await client.get(`user-seller-contact-${id}`) || ''
      
      const userSellerContact = {
        email: userContact ? JSON.parse(userContact).email: '',
        phone 
        
      } 
      
      client.set(`user-seller-contact-${id}`, JSON.stringify(userSellerContact))
      client.expire(`user-seller-contact-${id}`, 60 * 60 * 24)
      client.del(`user-seller-phone-${id}`)
      
      return res.status(200).json({ message: 'Phone number confirmed successfully'})
    }
      
    res.status(400).json({message: 'Code is not valid'})
  }
  
  public async AddInfoStore(req: Request,res: Response){
    try{
      const verifyToken = verifyTokenUser.execute(req,res)
      const id = verifyToken.userId
        
      if(!verifyToken.auth){
        return
      }
      
      const { name,description,category } = req.body
      
      const userSellerContact = await client.get(`user-seller-contact-${id}`) || ''
      
      const userContact = userSellerContact ? JSON.parse(userSellerContact): userSellerContact
      
      if(!userContact || !userContact.email || !userContact.phone){
        return res.status(400).json({message: 'Error email and phone are required. Confirm in other router'})
      }
      
      const status = req.body.status === 'true' || req.body.status === 'false' ? 
        Boolean(req.body.status)
        :
        req.body.status 
      
      const validateInfos = new ValidateSellerAccountInfo(
          name || '',
          description || '',
          category || '',
          status || ''
        ).execute()
      
      
      if(validateInfos.message){
        return res.status(400).json({message: validateInfos.message})
      }
      
      const user = {
        userId: id,
        emailStore: userContact.email,
        phone: userContact.phone,
        storeName: name,
        category: category || '',
        description,
        status
      }
      
      const verifySellerAccount = new VerifySellerAccount(id as number,user.emailStore,user.phone)
      
      const verify = await verifySellerAccount.verifyInfoSeller()
      
      if(verify){
        return res.status(400).json({message: verify.message})
      }
      
      await Seller.create(user)
      
      const sellerInfo = new SellerInfoOnCache()
    
      const sellerInfoCreate = await sellerInfo.add({
          id,
          email: user.emailStore,
          phone: user.phone
      })
    
      
      res.status(200).json({message: 'seller account created with successfully'})
      
    }
    catch{
      res.status(501).json({message: 'Internal server error'})
    }
  }
}

export default new SellerAccountController