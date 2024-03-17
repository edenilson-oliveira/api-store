import { Request,Response,NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../database/models/user';

import EmailVerify from './EmailVerify'
import validator from '../utils/validator'
import generateTokenUser from '../authentication/GenerateTokenUser';
import generateRefreshToken from '../authentication/GenerateRefreshToken';
import VerifyToken from '../authentication/VerifyToken';
import SendMail from '../services/mail';
import CodeGenerate from '../services/codeGenerate';
import client from '../redisConfig'

type UserInfo = Pick<User,'firstName'|'lastName'|'email'|'password'>

class LoginUserControler{
  
  user: Partial<UserInfo>;
  
  constructor(){
    this.user = {}
  }

  public signUp = async (req: Request,res: Response) => {
    try{
      
      const {firstName,lastName,email,password} = req.body
      
      const validate = validator.execute(req.body)
      
      const emailVerify = new EmailVerify(email || '')
      
      const emailVerificationOnDatabase = await emailVerify.execute()
      
      if(validate.isValidate && !emailVerificationOnDatabase.emailExists){
        
        const hashPassword = await bcrypt.hash(password,10)
      
        const user = {
          firstName,
          lastName,
          email,
          password: hashPassword
        }
        
        const code = new CodeGenerate().execute()
        
        const sendMail = new SendMail(user.email,'Confirm Email', `<p>Confirm your email with code ${code} for to create account</p>`).execute()
        
        client.set(`code-${user.email}`, code)
        
        client.expire(`code-${user.email}`, 60)
        
        this.user = user
        return res.status(200).json({message: 'Confirm your email'})
      }
      
      res.status(400).json(
        {
          message: validate.message || 'Email already exists'
        })
    }
    
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  
  public confirmEmail = async (req: Request,res: Response) => {
    try{
      const email = req.body.email || ''
      
      const code = await client.get(`code-${email}`)
      if(code && req.body.code == code){
        const userCreated = await User.create(this.user)
          
        client.del(`code-${email}`)
        
        const token = generateTokenUser.execute(userCreated.dataValues.id)
        const refreshToken = generateRefreshToken.execute(userCreated.dataValues.id)
          
        return res.status(200).cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' }).json({token})
      }
      
      res.status(400).json({message: 'Code is invalid'})
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  
  public login = async (req: Request,res: Response,next: NextFunction) => {
    try{
      const { email, password } = req.body
      const emailVerify = new EmailVerify(email || '')
      
      const emailVerification = await emailVerify.execute()
      
      
      if(password && emailVerification.emailExists){
        const user = emailVerification.user
        const passwordValidate = await bcrypt.compare(password,user.password)
        
        if(passwordValidate){
          const token = generateTokenUser.execute(user.id)
          const refreshToken = generateRefreshToken.execute(user.id)
          
          return res.status(200).cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' }).json({token})
        }
        
        return res.status(400).json({message: 'password is invalid'})
      }
      
      res.status(404).end()
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
}

const loginUserControler = new LoginUserControler

export default loginUserControler