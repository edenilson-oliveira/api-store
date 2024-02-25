import { Request,Response,NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../database/models/user';

class UserController{
  
  private verifyToken(req: Request,res: Response,next: NextFunction){
      const bearerHeader = req.headers['authorization']
      if(bearerHeader){
        const token = bearerHeader.split('Bearer ')[1]
        const tokenVerification = jwt.verify(token,process.env.SECRET_KEY as string,(err,decoded) => {
          if(err){
            res.status(403).json({message: 'Failed to authenticate token'})
            return
          }
          
          
          return decoded
        })
        return tokenVerification
      }
      else{
        res.status(401).json({message:'Token not was provided'})
      }
    }
  
  public getUsers = async (req: Request,res: Response,next: NextFunction) => {
    
    this.verifyToken(req,res,next)
   
    try{
      const user = await User.findAll({})
      res.json(user).status(200)
    }
    
    catch{
      res.status(501)
    }
    
  }
  
  private async emailAlreadyThere(email: string): Promise<boolean> {
    const users = await User.findAll({})
    return users.some((value:User): boolean => value.dataValues.email === email)
  }
  
  public createUser = async (req: Request,res: Response,next:NextFunction) => {
    try{
      
      const hashPassword = await bcrypt.hash(req.body.password,10)
      
      const user = {
        firstName: req.body.firstName,lastName: req.body.lastName,email: req.body.email, password: hashPassword
      }
      
      const emailVerificationOnDatabase = await this.emailAlreadyThere(user.email)
      
      if(!emailVerificationOnDatabase){
        
        const userCreated = await User.create(user)
        
        const token = jwt.sign({id: userCreated.dataValues.id},process.env.SECRET_KEY as string, {expiresIn: '1h'})
        
        res.json({token}).status(200)
      }
      
      else{
        res.status(403).json({message: "Email or password are invalid"})
      }
    }
    
    catch{
      res.status(501).json({message: 'Internal server error'})
    }
  }
  
  public login = async (req: Request,res: Response) => {
    const { email, password } = req.body
    const emailVerification = await this.emailAlreadyThere(email)
    
    if(emailVerification ){
      const userData = await User.findAll({
        where: {
          email:email
        }
      })
      const user = userData[0].dataValues
      const passwordValidate = await bcrypt.compare(password,user.password)
      if(passwordValidate){
        const token = jwt.sign({id: user.id},process.env.SECRET_KEY as string,{expiresIn: '1h'})
        res.json({token}).status(200)
      }
      else{
        res.status(403).end()
      }
    }
    
    else{
      res.status(403).end()
    }
    
  }
}

const userController = new UserController()

export default userController