import { Request,Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../database/models/user';

import EmailVerify from './EmailVerify'
import validator from '../utils/validator'
import generateTokenUser from '../authentication/GenerateTokenUser';
import VerifyToken from '../authentication/VerifyToken';
import SendMail from '../services/mail';
import CodeGenerate from '../services/codeGenerate';
import client from '../redisConfig'

interface UserInfo{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

class LoginUserControler{
  
  user: Partial<UserInfo>;
  
  constructor(){
    this.user = {}
  }

  public signUp = async (req: Request,res: Response) => {
    try{
      
      const {firstName,lastName,email,password} = req.body
      
      const hashPassword = await bcrypt.hash(password,10)
      
      const user = {
        firstName,
        lastName,
        email,
        password: hashPassword
      }
      const validate = validator.execute(req.body)
      
      const emailVerify = new EmailVerify(user.email)
      
      const emailVerificationOnDatabase = await emailVerify.execute()
      
      if(validate.isValidate && !emailVerificationOnDatabase.emailExists){
        
        const code = new CodeGenerate().execute()
        
        const sendMail = new SendMail(user.email,'Confirm Email', `Confirm your email with code ${code}`).execute()
        
        client.set('getCode', code)
        
        client.expire('getCode', 60)
        
        this.user = user
        res.status(200).json({message: 'Confirm your email'})
      }
      
      
      else if(emailVerificationOnDatabase
      .emailExists){
        res.status(409).json({message: 'Email Already Exists'})
      }
      
      else{
        res.status(400).json({message: validate.message})
      }
    }
    
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  
  public confirmEmail = async (req: Request,res: Response) => {
    try{
      const code = await client.get('getCode')
      if(code && req.body.code == code){
        const userCreated = await User.create(this.user)
          
        const token = generateTokenUser.execute(userCreated.dataValues.id)
        client.set('getCode','')
        return res.status(200).json({token})
      }
      
      res.status(400).json({message: 'Code is invalid'})
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  
  public login = async (req: Request,res: Response) => {
    try{
      const { email, password } = req.body
      const emailVerify = new EmailVerify(email)
      
      const emailVerification = await emailVerify.execute()
      
      if(emailVerification.emailExists){
        const user = emailVerification.user
        const passwordValidate = await bcrypt.compare(password,user.password)
        
        if(passwordValidate){
          const token = generateTokenUser.execute(user.id)
          
          res.json({token}).status(200)
        }
        else{
          res.status(400).json({message: 'password is invalid'}).end()
        }
      }
      
      else{
        res.status(404).end()
      }
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
}

const loginUserControler = new LoginUserControler

export default loginUserControler