import { Request,Response } from 'express';
import Product from '../database/models/product';

class ProductController{
  public async getProducts(req: Request,res: Response){
    try{
      const products = await Product.findAll({
        limit: 20
      })
      
      res.status(200).json(products)
    }
    catch(err){
      console.log(err)
      res.status(500).json({message: 'Internal server error'})
    }
  }
}

export default new ProductController