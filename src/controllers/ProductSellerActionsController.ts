import { Request,Response,NextFunction } from 'express';
import Product from '../database/models/product';
import verifyTokenUser from '../authentication/VerifyToken';
import VerifyUserIsSeller from '../repository/VerifyUserIsSeller';
import ValidateCategory from '../services/validateCategory';
import ValidateInfoAboutProduct from '../services/validateInfoAboutProduct';
import client from '../redisConfig';
import cloudinary from '../services/cloudinary'
import Express from 'express'
import upload from '../middleware/multer'
import { resourceUsage } from 'process';
import { error } from 'console';

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

  public async addImageProduct(req: Request, res: Response, next: NextFunction){
    try{
      const verifyToken = verifyTokenUser.execute(req,res)
      const id = verifyToken.userId || 0
          
      if(!verifyToken.auth){
        return
      }
      
      const verifyUserIsSeller = new VerifyUserIsSeller(id)

      const verifyAccountSeller = await verifyUserIsSeller.execute()

      if(verifyAccountSeller){
        return res.status(401).json({message: verifyAccountSeller})
      }

      const filesImagesPoducts = await client.get(`files-images-product-${id}`) || ''
      
      const files = JSON.parse(filesImagesPoducts)


      const uploads = await Promise.allSettled(
        files.map((value: any) => cloudinary.uploadImage('value.path'))
      ).then((result: any) => {
        return result
      }).catch((err) => {
        return err
      })

      if(!uploads.value){
        return res.status(400).json({message: 'Error on upload'})
      }
      
      await Promise.all([
        client.del(`files-images-product-${id}`),
        client.set(`images-products-${id}`,JSON.stringify({
          filename: uploads.filename,
          url: uploads.url
      }))])

      res.status(200).end()
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  
  public async addProduct(req: Request,res: Response){
    try{
      const verifyToken = verifyTokenUser.execute(req,res)
      const id = verifyToken.userId || 0
          
      if(!verifyToken.auth){
        return
      }
      
      const verifyUserIsSeller = new VerifyUserIsSeller(id)
        
      const [verify,getImageOfProduct] = await Promise.all([
        verifyUserIsSeller.execute(),
        client.get(`seller-product-image-${id}`)
      ])
        
      if(verify){
        return res.status(401).json({message: verify})
      }

      if(!getImageOfProduct){
        return res.status(404).json({message:'product image not found'})
      }
      
      const { name,price,quantity,discount,description,category } = req.body
      
      const verifyCategory = new ValidateCategory().verifyCategoryExist(category || '')
      
      if(!verifyCategory){
        return res.status(404).json({message: 'Category not found'})
      }
      
      const validateInfoProduct = new ValidateInfoAboutProduct()
      const validate = validateInfoProduct.validateAllInfo(name,price,quantity,discount,description)
      
      if(validate){
        return res.status(400).json({message: validate})
      }
      
      if(Number(price) <= 0 || Number(quantity) <= 0){
        return res.status(400).json({message: 'Price and quantity must be greater than 0'})
      }
      console.log(req.files)
      res.status(200).json({message: req.files})
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
}

export default new ProductSellerActionsController