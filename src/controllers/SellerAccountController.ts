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
      
      const sellerInfoOnDb = await Seller.findAll({
          where: {
            userId: id
          }
        })
      const sellerInfo = sellerInfoOnDb[0].dataValues
        
      const sellerInfoDataToEdit = {
        storeName: req.body.name  || sellerInfo.storeName,
        status: req.body.status  || sellerInfo.status,
        emailStore: req.body.email  || sellerInfo.emailStore,
        phone: req.body.phone  || sellerInfo.phone,
        category: req.body.category  || sellerInfo.category,
        description: req.body.description  || sellerInfo.description
      }
      
      
      const { emailStore,phone,storeName,description,category,status } = sellerInfoDataToEdit
      
      const validateInfos = new ValidateSellerAccountInfo()
      
      const validate = validateInfos.validateAllInfos(emailStore,phone,storeName,description,category,status)
      
      if(validate){
        return res.status(400).json({message: validate})
      }
      
      res.status(200).end()
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
}

export default new SellerAccountController