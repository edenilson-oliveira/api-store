import { Request,Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../database/models/user';
import EmailVerify from './EmailVerify'
import validator from '../utils/validator'
import generateTokenUser from '../authentication/GenerateTokenUser';
import VerifyToken from '../authentication/VerifyToken';


class UserAccountController{
  
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
        
        const hashPassword = await bcrypt.hash(password,10)
        
        let userPassword = ''
        
        if(password && password.length < 8){
          userPassword = password
        }
        else if(!password){
          userPassword = userInfo.password
        }
        else{
          userPassword = hashPassword
        }
        
        const user = {
          firstName: firstName ? firstName: userInfo.firstName,
          lastName: lastName ? lastName: userInfo.lastName,
          email: email ? email: userInfo.email,
           password: userPassword
        }
        
        
        const emailVerify = new EmailVerify(email)
      
        const emailVerification = await emailVerify.execute()
      
        const validate = validator.execute(user)
        
        if(validate.isValidate && !emailVerification.emailExists){
          
          await User.update(user,{
            where: {
              id
            }
          })
          
          res.status(200).end()
        }
        else if(!validate.isValidate){
          res.status(400).json({message: validate.message})
        }
        else{
          res.status(400).json({message: 'Email already exists'})
        }
      }
    }
    catch(err){
      res.status(500).json({message: 'Internal server error'})
    }
  }
}


const userAccountController = new UserAccountController

export default userAccountController