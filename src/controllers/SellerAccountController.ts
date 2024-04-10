import { Request,Response } from 'express';
import Seller from '../database/models/seller';
import verifyTokenUser from '../authentication/VerifyToken';
import VerifyUserIsSeller from '../repository/VerifyUserIsSeller'

class SellerAccountController{
  public async GetInfoSellerAccount(req: Request,res: Response){
    try{
      const verifyToken = verifyTokenUser.execute(req,res)
        const id = verifyToken.userId || 0
        
      if(!verifyToken.auth){
        return
      }
      
      const verifyUserIsSeller = new VerifyUserIsSeller(id)
      
      const verify = await verifyUserIsSeller.execute()
      
      if(typeof verify === 'string'){
        return res.status(403).json({message: verify})
      }
      
      const sellerInfo = await Seller.findAll({
          where: {
            userId: id
          }
        })
        
      res.status(200).json({sellerInfo})
    }
  
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
}

export default new SellerAccountController