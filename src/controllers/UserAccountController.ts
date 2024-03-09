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
//import { UserInfo } from './LoginUserController'
interface UserInfo{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
interface UserData{
  user: Partial<UserInfo>;
  id: number;
}

class UserAccountController{
  
  userData: UserData
  
  constructor(){
    this.userData = {user:{},id:0}
  }
  
  public getUser = async (req: Request,res: Response) => {
    
    try{
      
      const verifyToken = new VerifyToken().execute(req,res)
      const id = verifyToken.userId
      
      if(verifyToken.auth){
        const user = await User.findAll({
          where:{
            id
          } 
        })
        res.status(200).json(user)
      }
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  
  public deleteAccount = async (req: Request,res: Response) => {
    
    try{
      
      const verifyToken = new VerifyToken().execute(req,res)
      const id = verifyToken.userId
      
      if(verifyToken.auth){
        const user = await User.destroy({
          where:{
            id
          } 
        })
        res.status(201).end()
      }
    }
    
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
    
  }
  
  public editAccount = async (req: Request,res: Response) => {
   
    
    try{
      const verifyToken = new VerifyToken().execute(req,res)
      const id = verifyToken.userId
      if(verifyToken.auth){
        
        const userFromDb:User["dataValues"] = await User.findAll({
            where: {
              id
            }
          })
          
        const userInfo = userFromDb[0].dataValues
        const {firstName,lastName,email,password} = req.body
        
        let userPassword = ''
        
        if(password && password.length < 8){
          userPassword = password
        }
        else if(!password){
          userPassword = userInfo.password
        }
        else{
          userPassword = await bcrypt.hash(password,10)
        }
        
        const user = {
          firstName: firstName ? firstName: userInfo.firstName,
          lastName: lastName ? lastName: userInfo.lastName,
          email: email ? email: userInfo.email,
          password: userPassword
        }
        
        let isEmailExists = false
        if(email){
          const emailVerify = new EmailVerify(email)
      
          const emailVerification = await emailVerify.execute()
          
          isEmailExists = emailVerification.emailExists
        }
        
        
      
        const validate = validator.execute(user)
        
        if(validate.isValidate && !isEmailExists){
          if(userPassword === userInfo.password && user.email === userInfo.email){
            
            await User.update(user,{
              where: {
                id
              }
            })
            
            return res.status(200).end()
          }
          
          this.userData = {user,id: id as any}
          
          const code = new CodeGenerate().execute()
        
          const sendMail = new SendMail(user.email,'Confirm Email', `Confirm your email with code ${code}`).execute()
        
          client.set('getCodeEdit', code)
        
          client.expire('getCodeEdit', 60)
          
          return res.status(200).json({message: 'Confirm your email'})
          
        }
        
        res.status(400).json(
          {
            message: validate.message ? validate.message : 'Email already exists'
          })
      }
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  
  public confirmEmailEdit = async (req: Request,res: Response) => {
    try{
      const code = await client.get('getCodeEdit')
      if(req.body.code === code){
        
        const { user,id } = this.userData
        
        await User.update(user,{
          where: {
            id
          }
        })
        
        client.set('getCodeEdit','')
        
        return res.status(200).end()
      }
      
      res.status(400).json({message: 'Code is invalid'})
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  
}


const userAccountController = new UserAccountController

export default userAccountController