import { Request,Response,NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

interface Auth{
  auth: boolean;
  id?: number;
}

class VerifyToken{
  public execute(req: Request,res: Response,next: NextFunction){
      const bearerHeader = req.headers['authorization']
      if(bearerHeader){
        const token = bearerHeader.split('Bearer ')[1]
        const tokenVerification = jwt.verify(token,process.env.SECRET_KEY as string,(err,decoded) => {
          if(err){
            res.status(401).json({message: 'Failed to authenticate token'})
            return {auth: false, }
          }
          
          
          return {auth: true,id: decoded}
        })
        return tokenVerification
      }
      else{
        res.status(400).json({message:'Token not was provided'})
      }
    }
}

export default VerifyToken