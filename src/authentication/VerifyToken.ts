import { Request,Response } from 'express';
import jwt from 'jsonwebtoken';
import {JwtPayload } from 'jsonwebtoken'
import 'dotenv/config';

interface Auth{
  auth: boolean;
  userId?: number;
}

interface TokenUser{
  id: number
}

class VerifyToken{
  private BearerHeaderData: {exist: boolean, token: string};
  
  constructor(){
    this.BearerHeaderData = {exist: false, token: ''}
  }
  
  public getBearerHeaderData(){
    return this.BearerHeaderData
  }
  
  public TokenOnBearerHeader(headers: any) {
    const bearerHeader = headers.authorization
    
    if(bearerHeader){
      const token = bearerHeader.split('Bearer ')[1]
      this.BearerHeaderData.token = token
      this.BearerHeaderData.exist = true
    }
  }
  
  public getTokenOnly(token: string,secretKey=process.env.JWT_TOKEN_KEY): TokenUser{
    let tokenVerification: TokenUser = {id:0};
    try{
      tokenVerification = jwt.verify(token, secretKey as string) as TokenUser
    }
    catch{
      return tokenVerification
    }
    return tokenVerification
  }
  
  
  public execute(req: Request,res: Response): Auth{
      this.TokenOnBearerHeader(req.headers)
      const { exist } =  this.BearerHeaderData
      
      if(exist){
        const { token } = this.BearerHeaderData
        const verifyToken = this.getTokenOnly(token)
        
        if(!verifyToken.id){
          res.status(401).json({message: 'Failed to authenticate token'})
          return {auth: false}
          
        }
        
        return {auth: true,userId: verifyToken.id}
        
      }
      
      res.status(400).json({message:'Token not was provided'})
      return {auth: false}
  }
}

export default new VerifyToken