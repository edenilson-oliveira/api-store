import { Request,Response } from 'express';
import { Op } from 'sequelize';
import Product from '../database/models/product';
import ImageProducts from '../database/models/image-products';
import ValidateCategory from '../services/validateCategory';

class ProductController{
  public async getProducts(req: Request,res: Response){
    try{
      const limit = Number(req.query.limit) < 10 ? Number(req.query.limit) : 10
      const page = Number(req.query.page) || 1
      
      const productsCount = await Product.count({})

      const products: Product[] = await Product.findAll({
        offset: page * limit - limit,
        limit
      })

      const returnIdOfProducts = products.map((value: Product) => {
        return {productId: value.dataValues.id}
      })

      const pagination = {
        totalResults: products.length,
        productsCount
      }

      if(!returnIdOfProducts.length){
        return res.status(200).json([{
          product: {},
          image: {}
        },{
          pagination
        }])
      }

      const images: ImageProducts[] = []

      await Promise.all(products.map(async (value: Product) => {
        const [imagesRequest] = await ImageProducts.findAll({
          where: {
            productId: value.dataValues.id
          },
          limit: 1
        })
        images.push(imagesRequest)
      }))
       
      const response = products.map((value: Product) => {
        const [imagesResponse] = images.filter((image: ImageProducts) => image.dataValues.productId === value.dataValues.id)
        return {
          product: value,
          image: imagesResponse
        }
      })

      res.status(200).json({response,pagination})
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  
  public async getProductBySearch(req: Request,res: Response){
    try{

      const limit = Number(req.query.limit) < 10 ? Number(req.query.limit) : 10
      const page = Number(req.query.page) || 1
      
      
      const { search } = req.params
      
      if(!search){
        return res.status(401).json({message: 'Search not provided'})
      }
      
      const productsCount = await Product.count({
        where: {
          name: { [Op.like]: `%${search}%`}
        },
      })

      const products = await Product.findAll({
        where: {
          name: { [Op.like]: `%${search}%`}
        },
        offset: page * limit - limit,
        limit: limit
      })
      
      if(products.length === 0){
        return res.status(404).json({message: 'Products not found'})
      }

      const returnIdOfProducts = products.map((value: Product) => {
        return {productId: value.dataValues.id}
      })

      const pagination = {
        totalResults: products.length,
        productsCount
      }

      if(!returnIdOfProducts.length){
        return res.status(200).json([{
          product: {},
          image: {}
        },{
          pagination
        }])
      }

      const images: ImageProducts[] = []

      await Promise.all(products.map(async (value: Product) => {
        const [imagesRequest] = await ImageProducts.findAll({
          where: {
            productId: value.dataValues.id
          },
          limit: 1
        })
        images.push(imagesRequest)
      }))
       
      const response = products.map((value: Product) => {
        const [imagesResponse] = images.filter((image: ImageProducts) => image.dataValues.productId === value.dataValues.id)
        return {
          product: value,
          image: imagesResponse
        }
      })

      res.status(200).json({response,pagination})
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  public async getProductsByCategory(req: Request,res: Response){
    try{

      const { category } = req.params || ''
      
      const verifyCategory = new ValidateCategory().verifyCategoryExist(category || '')
        
      if(!verifyCategory){
        return res.status(404).json({message: 'Category not found'})
      }

      const limit = Number(req.query.limit) < 10 ? Number(req.query.limit) : 10
      const page = Number(req.query.page) || 1
      
      const productsCount = await Product.count({
        where: {
          category: category
        },
      })
      
      const products = await Product.findAll({ 
        where: {
          category: category
        },
        offset: page * limit - limit,
        limit: limit
      })
      
      const returnIdOfProducts = products.map((value: Product) => {
        return {productId: value.dataValues.id}
      })

      const pagination = {
        totalResults: products.length,
        productsCount
      }

      if(!returnIdOfProducts.length){
        return res.status(200).json([{
          product: {},
          image: {}
        },{
          pagination
        }])
      }

      const images: ImageProducts[] = []

      await Promise.all(products.map(async (value: Product) => {
        const [imagesRequest] = await ImageProducts.findAll({
          where: {
            productId: value.dataValues.id
          },
          limit: 1
        })
        images.push(imagesRequest)
      }))
       
      const response = products.map((value: Product) => {
        const [imagesResponse] = images.filter((image: ImageProducts) => image.dataValues.productId === value.dataValues.id)
        return {
          product: value,
          image: imagesResponse
        }
      })

      res.status(200).json({response,pagination})
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
}

export default new ProductController