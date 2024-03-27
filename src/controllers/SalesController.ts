import { Request,Response,NextFunction } from 'express';
import Sales from '../database/models/sales';
import verifyTokenUser from '../authentication/VerifyToken';
import SendMail from '../services/mail';
import SendSms from '../services/sendSms'
import CodeGenerate from '../services/codeGenerate';
import client from '../redisConfig'

class SalesController{
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
        const salesEmail = await Sales.findAll({
          where: {
            emailStore: email
          }
        })
        
        if(salesEmail.length > 0){
          return res.status(409).json({message: 'Email already exist'})
        }
        
        const code = new CodeGenerate().execute()
        
        const sendMail = new SendMail(email,'Confirm Email', `
        <h1>Api Store</h1>
        <p>Confirm your email with code ${code} for to create account of sales</p>
        `).execute()
        
        const userSalesEmail = { email, code }
        
        client.set(`user-sales-email-${id}`, JSON.stringify(userSalesEmail))
        
        client.expire(`user-sales-email-${id}`, 60)
        
        
        return res.status(200).json('Confirm your email')
      }
      
      res.status(400).json({message: 'Email is not valid'})
    }
  catch{
    res.status(500).json({message: 'Internal server error'})
    }
  }
  
  public async confirmEmailSales(req: Request,res: Response){
    const verifyToken = verifyTokenUser.execute(req,res)
    const id = verifyToken.userId
      
    if(!verifyToken.auth){
      return
    }
      
    const userCode = req.body.code
      
    const userInfo  = await client.get(`user-sales-email-${id}`) || ''
      
    if(!userInfo){
      return res.status(404).end()
    }
      
    const { code, email } = JSON.parse(userInfo)
      
    if(userCode === code){
      const userContact  = await client.get(`user-sales-contact-${id}`) || ''
      
      const userSalesContact = { email, phone: JSON.parse(userContact).phone} 
      
      client.set(`user-sales-contact-${id}`, JSON.stringify(userSalesContact))
      client.expire(`user-sales-contact-${id}`, 60 * 60 * 24)
      client.del(`user-sales-email-${id}`)
      
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
        const salesPhone = await Sales.findAll({
          where: {
            phone
          }
        })
        
        if(salesPhone.length > 0){
          return res.status(409).json({message: 'Phone number already exist'})
        }
        
        const code = new CodeGenerate().execute()
        
        const userSalesPhone = { phone, code }
        
        const sendSms = new SendSms(`Confirm your phone number with code ${code}`, phone)
        const send = await sendSms.execute()
        
        if(!send.body){
          return res.status(400).json({message: send})
        }
        
        client.set(`user-sales-phone-${id}`, JSON.stringify(userSalesPhone))
        
        client.expire(`user-sales-phone-${id}`, 60)
        
        return res.status(200).json('Confirm your phone number')
      }
      
      res.status(400).json({message: 'Phone number is not valid'})
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  
  public async confirmPhoneSales(req: Request,res: Response){
    const verifyToken = verifyTokenUser.execute(req,res)
    const id = verifyToken.userId
      
    if(!verifyToken.auth){
      return
    }
      
    const userCode = req.body.code
      
    const userInfo  = await client.get(`user-sales-phone-${id}`) || ''
      
    if(!userInfo){
      return res.status(404).end()
    }
      
    const { code, phone } = JSON.parse(userInfo)
      
    if(userCode === code){
      const userContact  = await client.get(`user-sales-contact-${id}`) || ''
      
      const userSalesContact = { email: JSON.parse(userContact).email, phone } 
      
      client.set(`user-sales-contact-${id}`, JSON.stringify(userSalesContact))
      client.expire(`user-sales-contact-${id}`, 60 * 60 * 24)
      client.del(`user-sales-phone-${id}`)
      
      return res.status(200).json({ message: 'Phone number confirmed successfully'})
    }
      
    res.status(400).json({message: 'Code is not valid'})
  }
  
}

export default new SalesController