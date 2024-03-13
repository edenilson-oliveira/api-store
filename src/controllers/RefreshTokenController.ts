import { Request,Response } from 'express';
import jwt from 'jsonwebtoken';
import RefreshToken from '../database/models/refreshToken';
import 'dotenv/config'
import generateTokenUser from '../authentication/GenerateTokenUser';

interface UserId{
  id: number;
}

class RefreshTokenController{
  public async refreshToken(req: Request,res: Response){
    try{
      const token  = req.cookies.refreshToken
      
      const secretKey = process.env.JWT_REFRESH_TOKEN_KEY as string
      
      let userId = 0
      
      try{
        if(!token){
          return res.status(401).json({message: 'Refresh Token not was provided'})
        }
        
        const tokenVerification: UserId = jwt.verify(token,secretKey) as UserId
        userId = tokenVerification.id
      }
      catch(err){
        return res.status(400).json({message: 'Token is not valid, try a new login'})
      }
      
      const tokenVerify = await RefreshToken.findAll({
        where: {
          userId
        }
      })
      
      if(tokenVerify.length){
        const token = generateTokenUser.execute(userId)
        return res.status(200).json({token})
      }
      
      res.status(404).json({message: 'Refresh Token not Found'})
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  
}

export default new RefreshTokenController