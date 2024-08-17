import { Request,Response,NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../database/models/user';

import EmailVerify from '../repository/EmailVerify'
import ValidateUserAccountInfo from '../services/validateUserAccountInfo'
import generateTokenUser from '../authentication/GenerateTokenUser';
import generateRefreshToken from '../authentication/GenerateRefreshToken';
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
      
      const validate = new ValidateUserAccountInfo(req.body).execute()
      
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

  public async SendCodeForChangePassword(req: Request,res: Response){
    try{
      const {email} = req.body

      if(!email){
        return res.status(400).json({message: 'Email not was provided'})
      }

      const emailVerify = new EmailVerify(email || '')

      const emailVerification = await emailVerify.execute()

      if(!emailVerification.emailExists){
        return res.status(404).json({message: 'Email not found'})
      }

      const code = new CodeGenerate().execute()
        
      const sendMail = new SendMail(email,'Confirm Email', `<p>Confirm your email with code ${code} for to change your password</p>`)
      await sendMail.execute()
        
      client.set(`code-change-password-${email}`, code)
        
      client.expire(`code-change-password-${email}`, 180)

      res.status(200).json({message: 'Confirm your email'})
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }

  public async confirmCodeForChangePassword(req: Request,res: Response){
    try{
      const {email} = req.body

      if(!email){
        return res.status(400).json({message: 'Email not was provided'})
      }

      const code = await client.get(`code-change-password-${email}`)

      if(!code){
        return res.status(404).json({message: 'Code not was provided'})
      }

      if(req.body.code === code){
        client.del(`code-change-password-${email}`)
        client.set(`user-email-${email}-code-was-confirmed`,'1')
        client.expire(`code-change-password-${email}`, 180)

        return res.status(200).end()
      }
      
      res.status(400).json({message: 'Code is invalid'})
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }

  public async changePassword(req: Request,res: Response){
    try{
      const {email,password} = req.body

      if(!email){
        return res.status(400).json({message: 'Email not was provided'})
      }

      const codeWasConfirmed = await client.get(`user-email-${email}-code-was-confirmed`)

      if(!Number(codeWasConfirmed)){
        return res.status(400).json({message: 'Error with code'})
      }

      if(!(password.length >= 8)){
        return res.status(400).json({message: 'Password must be at least 8 characters long'})
      }

      const hashPassword = await bcrypt.hash(password,10)

      await Promise.all([await User.update({password: hashPassword},{
        where: {
          email
        }
      }),client.del(`user-email-${email}-code-was-confirmed`)])

      res.status(200).end()
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
}

const loginUserControler = new LoginUserControler

export default loginUserControler