import { Request,Response } from 'express';
import Product from '../database/models/product';
import verifyTokenUser from '../authentication/VerifyToken';
import VerifyUserIsSeller from '../repository/VerifyUserIsSeller';

class ProductSellerActionsController{
  public async getProductsOfStore(req: Request,res: Response){
    try{
      const verifyToken = verifyTokenUser.execute(req,res)
        const id = verifyToken.userId || 0
          
      if(!verifyToken.auth){
        return
      }
        
      const verifyUserIsSeller = new VerifyUserIsSeller(id)
        
      const verify = await verifyUserIsSeller.execute()
        
      if(verify){
        return res.status(401).json({message: verify})
      }
      
      const products = Product.findAll({
        where: {
          sellerId: id
        },
        limit: 20
      })
      
      res.status(200).json(products)
    }
  catch{
    res.status(500).json({message: 'Internal server error'})
    }
  }
}

export default new ProductSellerActionsController