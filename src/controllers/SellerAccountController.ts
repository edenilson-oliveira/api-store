import { Request,Response } from 'express';
import verifyTokenUser from '../authentication/VerifyToken';
import VerifyUserIsSeller from '../repository/VerifyUserIsSeller'

class SellerAccountController{
  public async GetInfoSellerAccount(res: Response,req: Request){
    const verifyToken = verifyTokenUser.execute(req,res)
      const id = verifyToken.userId
      
    if(!verifyToken.auth){
      return
    }
    
    const verifyUserIsSeller = new VerifyUserIsSeller(id)
    
    const verify = await verifyUserIsSeller.execute()
    
  }
}

export default new SellerAccountController