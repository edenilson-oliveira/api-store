import { Request,Response,NextFunction } from 'express';
import Seller from '../database/models/seller';
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
import ImageProducts from '../database/models/image-products';

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
      
      const imageProductsInfo = uploads.map((upload: any) => {
        return { filename: upload.value.original_filename, url: upload.value.url}
      })

      await Promise.all([
        client.del(`files-images-product-user-${id}`),
        client.set(`images-products-${id}`,JSON.stringify(imageProductsInfo))])

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
        
      const [verify,getImagesOfProduct] = await Promise.all([
        verifyUserIsSeller.execute(),
        client.get(`images-products-${id}`)
      ])
      if(verify){
        return res.status(401).json({message: verify})
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
      
      if(!getImagesOfProduct){
        return res.status(404).json({message:'Images product not found'})
      }

      const sellerId = await Seller.findAll({
        attributes: ['id'],
        where: {
          userId: id
        }
      })
      
      
      const productAdd = await Product.create({
        sellerId: sellerId[0].dataValues.id,
        name: name || '',
        price: price || 0,
        quantity: quantity || 0,
        discount: discount || 0,
        description: description || '',
        category: category || ''
      })

      const imageProductsInfo = JSON.parse(getImagesOfProduct)

      await Promise.all([
        imageProductsInfo.map((value: any) => {
          ImageProducts.create({
            productId: productAdd.dataValues.id,
            filename: value.filename,
            url: value.url
          })
        }), client.del(`images-products-${id}`) ]
      )

      res.status(200).end()

    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }

  public async editInfoProduct(req: Request,res: Response){
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
      
      const { name,price,quantity,discount,description,category } = req.body
      
      const productId = req.params.id

      if(!Number(productId)){
        return res.status(400).json({message: 'Product id is not valid'})
      }
      
      const productOnDatabase = await Product.findAll({
        where: {
          id: productId
        }
      })

      if(!productOnDatabase.length){
        return res.status(404).json({message: 'Product not found'})
      }

      const productActual = productOnDatabase[0].dataValues
      
      const productInfo = {
        name: name || productActual.name,
        price: price || productActual.price,
        quantity: quantity || productActual.quantity,
        discount: discount || productActual.discount,
        description: description || productActual.description
      }

      const validateInfoProduct = new ValidateInfoAboutProduct()
      const validate = validateInfoProduct.validateAllInfo(
        productActual.name,
        productInfo.price,
        productInfo.quantity,
        productInfo.discount,
        productInfo.description
      )
      
      
      const verifyCategory = new ValidateCategory().verifyCategoryExist(category || '')
      
      if(!verifyCategory){
        return res.status(404).json({message: 'Category not found'})
      }
      
      if(validate){
        return res.status(400).json({message: validate})
      }
      
      await Product.update({
        name: productActual.name,
        price: productInfo.price,
        quantity: productInfo.quantity,
        discount: productInfo.discount,
        description: productInfo.description
      },
      {
        where: {
          id: productId
        }
      })
      
      res.status(200).end()
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  public async addMoreImagesProducts(req: Request,res: Response){
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

      const productId = req.params.id

      if(isNaN(Number(productId))){
        return res.status(400).json({message: 'Id is not valid ou not provided'})
      }

      const filesImagesPoducts = await client.get(`files-images-product-user-edit-${id}`) || ''
      
      const files = JSON.parse(filesImagesPoducts)

      const imagesOfProduct = await ImageProducts.findAll({
        where:{
          productId
        }
      })
        
      if(!imagesOfProduct.length){
        return res.status(404).json({message: 'Product not found'})
      }

      if(imagesOfProduct.length + files.length >= 10){
        return res.status(400).json({message: 'Many files, files cannot be more than 10 on database'})
      }

      const uploads = await Promise.allSettled(
        files.map((value: any) => cloudinary.uploadImage(value.path))
      ).then((result: any) => {
        return result
      }).catch((err) => {
        return err
      })
      

      await Promise.all(
        uploads.map((upload: any) => {
          ImageProducts.create({
            productId,
            filename: upload.value.original_filename,
            url: upload.value.url
          })
        }))

      return res.status(200).end()
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }

  public async deleteImage(req: Request,res: Response){
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
      
      const { publicId } = req.params

      if(!publicId){
        return res.status(400).json({message: 'Public id of image not provided'})
      }

      const [imagePublicIdOnDatabase,imagePublicIdOnCloudinary] = await Promise.all([ImageProducts.findAll({
        where: {
          filename: publicId
        }
      }),cloudinary.searchImage(publicId)])


      if(!imagePublicIdOnDatabase[0]){
        if(imagePublicIdOnCloudinary.resources[0]){
          await cloudinary.deleteImage(imagePublicIdOnCloudinary.resources[0].public_id)
          return res.status(200).json({message: 'Image not found on database but found and deleted on cloudinary'})
        }
        return res.status(404).json({message: 'Image not found'})
      }

      if(!imagePublicIdOnCloudinary.resources[0] && imagePublicIdOnDatabase[0]){
        await ImageProducts.destroy({
          where: {
            filename: publicId
          }
        })
        return res.status(200).json({message: 'Image not found on cloudinary but found and deleted on database'})
      }

      const [deleteImageOnDatabase,deleteImageOnCloudinary] = await Promise.all([ImageProducts.destroy({
        where: {
          filename: publicId
        }
      }), cloudinary.deleteImage(imagePublicIdOnCloudinary.resources[0].public_id)])

      res.status(204).end()

    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }

  public async deleteProduct(req: Request,res: Response){
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

      const productId = req.params.id

      if(!productId || isNaN(Number(productId))){
        return res.status(400).json({message: 'Product id is not valid'})
      }

      const [deleteInfoProduct,deleteImageProduct,imagesOfProduct] = await Promise.all([
        Product.destroy({
          where: {
            id: productId
          }
        }),
        ImageProducts.destroy({
          where: {
            productId
          }
        }),
        ImageProducts.findAll({
          where: {
            productId
          }
        })
      ])

      
      if(!deleteInfoProduct){
        return res.status(404).json({message: 'Product not found'})
      }

      res.status(204).end()
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
}

export default new ProductSellerActionsController