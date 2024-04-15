import { Request,Response } from 'express';
import Seller from '../database/models/seller';
import verifyTokenUser from '../authentication/VerifyToken';
import ValidateSellerAccountInfo from '../services/validateSellerAccountInfo'; 
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
        return res.status(401).json({message: verify})
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
  
  public async EditInfoAccountSeller(req: Request,res: Response){
    try{
      const verifyToken = verifyTokenUser.execute(req,res)
      const id = verifyToken.userId || 0
          
      if(!verifyToken.auth){
        return
      }
        
      const verifyUserIsSeller = new VerifyUserIsSeller(id)
        
      const verify = await verifyUserIsSeller.execute()
        
      if(typeof verify === 'string'){
        return res.status(401).json({message: verify})
      }
      
      const { name,description,category,phone,email,status } = req.body
      
      const sellerInfoOnDb = await Seller.findAll({
          where: {
            userId: id
          }
        })
      const sellerInfo = sellerInfoOnDb[0].dataValues
        
      const sellerInfoDataToEdit = {
        storeName: name  || sellerInfo.storeName,
        status: status  || sellerInfo.status,
        emailStore: email  || sellerInfo.emailStore,
        phone: phone  || sellerInfo.phone,
        category: category  || sellerInfo.category,
        description: description  || sellerInfo.description
      }
      
      const validateInfos = new ValidateSellerAccountInfo()
      
      res.status(200).end()
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
}

export default new SellerAccountController