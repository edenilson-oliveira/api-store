import { Request,Response,NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../database/models/user';
import validator from '../utils/validator'
import generateTokenUser from '../authentication/GenerateTokenUser';
import VerifyToken from '../authentication/VerifyToken';


interface EmailVerify{
  emailExists: boolean;
  user: User["dataValues"];
}

class UserController{
  
  private async emailAlreadyThere(email: string): Promise<EmailVerify> {
    const users = await User.findAll({})
    return { 
      emailExists: users.some((value:User): boolean => value.dataValues.email === email),
      user: users.filter((value:User) =>{  if(value.dataValues.email === email){
          return value.dataValues
          }
        }
      )
    }
  }
  
  public getUser = async (req: Request,res: Response,next: NextFunction) => {
    
    new VerifyToken().execute(req,res,next)
   
    try{
      const user = await User.findAll({})
      res.status(200).json(user)
    }
    
    catch{
      res.status(501)
    }
    
  }
  

  public signUp = async (req: Request,res: Response) => {
    try{
      
      const hashPassword = await bcrypt.hash(req.body.password,10)
      
      const user = {
        firstName: req.body.firstName,lastName: req.body.lastName,email: req.body.email, password: hashPassword
      }
      const validate = validator.execute(req,res)
      
      const emailVerificationOnDatabase = await this.emailAlreadyThere(user.email)
      
      if(validate.isValidate && !emailVerificationOnDatabase.emailExists){
        
        const userCreated = await User.create(user)
        
        const token = generateTokenUser.execute(userCreated.dataValues.id)
        
        res.status(200).json({token})
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
      res.status(501).json({message: 'Internal server error'})
    }
  }
  
  public login = async (req: Request,res: Response) => {
    const { email, password } = req.body
    const emailVerification = await this.emailAlreadyThere(email)
    
    if(emailVerification.emailExists){
      const userData = emailVerification.user
      const user = userData[0].dataValues
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
      res.status(403).end()
    }
    
  }
}

const userController = new UserController()

export default userController