import { Request,Response } from 'express';
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
  private BearerHeaderData: {exist: boolean, token: string};
  
  constructor(){
    this.BearerHeaderData = {exist: false, token: ''}
  }
  private GetTokenBearerHeader(req: Request,res: Response) {
    const bearerHeader = req.headers['authorization']
    
    if(bearerHeader){
      const token = bearerHeader.split('Bearer ')[1]
      this.BearerHeaderData.token = token
      this.BearerHeaderData.exist = true
    }
    
  }
  
  public getTokenOnly(req: Request,res: Response): TokenUser{
    this.GetTokenBearerHeader(req,res)
    const { exist } =  this.BearerHeaderData
    let tokenVerification: TokenUser = {id:0}
    if(exist){
      const { token } = this.BearerHeaderData
      try{
        tokenVerification = jwt.verify(token,process.env.JWT_TOKEN_KEY as string) as TokenUser
      }
      catch{
        return tokenVerification
      }
    }
    return tokenVerification
  }
  
  
  public execute(req: Request,res: Response): Auth{
      this.GetTokenBearerHeader(req,res)
      const { exist } =  this.BearerHeaderData
      if(exist){
        const { token } = this.BearerHeaderData
        
        const tokenVerification:any = jwt.verify(token,process.env.JWT_TOKEN_KEY as string,(err,decoded): any => {
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

export default new VerifyToken