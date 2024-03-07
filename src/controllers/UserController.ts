import { Request,Response,NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../database/models/user';
import validator from '../utils/validator'
import generateTokenUser from '../authentication/GenerateTokenUser';
import VerifyToken from '../authentication/VerifyToken';
import SendMail from '../services/mail';
import CodeGenerate from '../services/codeGenerate';

interface EmailVerify{
  emailExists: boolean;
  user: User["dataValues"]|boolean;
}

interface UserInfo{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

class UserController{
  
  user: Partial<UserInfo>;
  code: string | undefined;
  
  constructor(){
    this.user = {}
  }
  
  private async emailAlreadyThere(email: string): Promise<EmailVerify> {
    const userDb = await User.findAll({
      where: {
        email
      }
    })
    
    return { 
      emailExists: userDb.length > 0 ? true : false,
      user: userDb.length ? userDb[0].dataValues: false
      }
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
      
      const emailVerificationOnDatabase = await this.emailAlreadyThere(user.email)
      
      if(validate.isValidate && !emailVerificationOnDatabase.emailExists){
        
        const code = new CodeGenerate().execute()
        
        const sendMail = new SendMail(user.email,'Confirm Email', `Confirm your email with code ${code}`).execute()
        this.user = user
        this.code = code
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
      if(this.code && req.body.code === this.code){
        const userCreated = await User.create(this.user)
          
        const token = generateTokenUser.execute(userCreated.dataValues.id)
        this.code = ''
        res.status(200).json({token})
      }
      else{
        res.status(400).json({message: 'Code is invalid'})
      }
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  
  public login = async (req: Request,res: Response) => {
    try{
      const { email, password } = req.body
      const emailVerification = await this.emailAlreadyThere(email)
      
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
  
  public editAccount = async (req: Request,res: Response,next: NextFunction) => {
   
    
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
        
        const emailVerification = await this.emailAlreadyThere(email)
      
        
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
      console.log(err)
      res.status(500).json({message: 'Internal server error'})
    }
  }
}

const userController = new UserController()

export default userController