import { Request,Response } from 'express';
import { Op } from 'sequelize';
import Product from '../database/models/product';


class ProductController{
  public async getProducts(req: Request,res: Response){
    try{
      const products = await Product.findAll({
        limit: 20
      })
      
      res.status(200).json(products)
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  
  public async getProductFromSearch(req: Request,res: Response){
    try{
      const { search } = req.params
      
      if(!search){
        return res.status(401).json({message: 'Search not provided'})
      }
      
      const products = await Product.findAll({
        where: {
          name: { [Op.like]: `%${search}%`}
        },
        limit: 20
      })
      
      if(products.length > 0){
        return res.status(200).json(products)
      }
      
      res.status(404).json({message: 'Products not found'})
    }
    catch{
      res.status(500).json({message: 'Internal server error'})
    }
  }
  
}

export default new ProductController