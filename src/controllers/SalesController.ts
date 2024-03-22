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
        
        client.set(`code-sales-${email}`, code)
        
        client.expire(`code-sales-${email}`, 60)
        
        
        return res.status(200).json('confirm your email')
      }
      
      res.status(400).json({message: 'Email is not valid'})
    }
  catch{
    res.status(500).json({message: 'Internal server error'})
    }
  }
}

export default new SalesController