import { Request,Response,NextFunction } from 'express';
import Sales from '../database/models/sales';
import verifyTokenUser from '../authentication/VerifyToken';
import SendMail from '../services/mail';
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
        
        client.set(`user-sales-${id}`, JSON.stringify(userSalesEmail))
        
        client.expire(`user-sales-${id}`, 60)
        
        
        return res.status(200).json('confirm your email')
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
      
    const userInfo  = await client.get(`user-sales-${id}`) || ''
      
    if(!userInfo){
      return res.status(404).end()
    }
      
    const { code, email } = JSON.parse(userInfo)
      
    if(userCode === code){
      const userSalesContact = { email, phone: '' } 
      client.set(`user-sales-contact-${id}`, JSON.stringify(userSalesContact))
      client.expire(`user-sales-contact-${id}`, 60 * 60 * 24)
        
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
        
      const validatePhone = /[(]{1}[0-9]{2}[)] [0-9]{4}[-][0-9]{4}$/
      
      const phoneIsValide = validatePhone.exec(phone)
      
      if(phoneIsValide){
        const salesEmail = await Sales.findAll({
          where: {
            phone
          }
        })
        
        if(salesEmail.length > 0){
          return res.status(409).json({message: 'Phone number already exist'})
        }
        
        const code = new CodeGenerate().execute()
      }
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  
}

export default new SalesController