import { Request,Response,NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {JwtPayload } from 'jsonwebtoken'
import 'dotenv/config';

interface Auth{
  auth: boolean;
  userId?: TokenUser;
}

interface TokenUser{
  id: number
}

class VerifyToken{
  public execute(req: Request,res: Response): Auth{
      const bearerHeader = req.headers['authorization']
      if(bearerHeader){
        const token = bearerHeader.split('Bearer ')[1]
        
        const tokenVerification:any = jwt.verify(token,process.env.SECRET_KEY as string,(err,decoded): any => {
          if(err){
            res.status(401).json({message: 'Failed to authenticate token'})
            return {auth: false}
          }
          const user = decoded as TokenUser
          
          return {auth: true,userId: user.id}
        })
        
        return tokenVerification
        
      }
      else{
        res.status(400).json({message:'Token not was provided'})
        return {auth: false}
      }
    }
}

export default VerifyToken