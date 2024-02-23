import { Request,Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../database/models/user';

class UserController{
  
  public async getUsers(req: Request,res: Response){
    try{
      const users = await User.findAll({})
      res.json(users).status(200)
    }
    catch{
      res.status(501)
    }
  }
  
  private async emailAlreadyThere(email: string): Promise<boolean> {
    const users = await User.findAll({})
    return users.some((value:User): boolean => value.dataValues.email === email)
  }
  
  public  createUser = async (req: Request,res: Response) => {
    try{
      const hashPassword = await bcrypt.hash(req.body.password,10)
      
     
      const user = {
        firstName: req.body.firstName,lastName: req.body.lastName,email: req.body.email, password: req.body.password.length >= 8 ?hashPassword:false
      }
      
      const emailVerification = await this.emailAlreadyThere(user.email)
      
      if(!emailVerification && user.password){
        
        const userCreated = await User.create(user)
        
        const token = jwt.sign({id: userCreated.dataValues.id},process.env.SECRET_KEY as string, {expiresIn: '8h'})
        res.json({userCreated, token}).status(200)
      }
      
      else{
        res.json({message: "Email or password are invalid"}).status(403)
      }
    }
    
    catch(err){
      console.log(err)
      res.json({message: 'Internal server error'}).status(501)
    }
  }
  
  public login = async (req: Request,res: Response) => {
    const { email, password } = await req.body
    const emailVerification = await this.emailAlreadyThere(email)
  }
}

const userController = new UserController()

export default userController