import { Request,Response,NextFunction } from 'express';
import verifyTokenUser from '../authentication/VerifyToken';
import Product from '../database/models/product';
import Cart from '../database/models/cart';

class UserActionsCartController{

    public async addProductOnCart(req: Request,res: Response){
        try{
            const verifyToken = verifyTokenUser.execute(req,res)
            const id = verifyToken.userId || 0
            
            if(!verifyToken.auth){
                return
            }

            const {productId,quantity} = req.body

            if(!Number(productId) || !Number(quantity)){
                return res.status(400).json({message: 'Error value is not valid'})
            }

            const [getProduct,productOnCart] = await Promise.all([Product.findAll({
                where: {
                    id: productId
                }
            }), Cart.findAll({
                where: {
                    productId
                }
            })])

            if(!getProduct.length){
                return res.status(404).json({message: 'Product not found'})
            }

            if(quantity > getProduct[0].dataValues.quantity){
                return res.status(400).json({message: `Error, quantity not must be than ${getProduct[0].dataValues.quantity}`})
            }

            if(productOnCart.length){
                return res.status(409).json({message: 'Error, product already exist on cart'})
            }

            await Cart.create({
                userId: id,
                productId,
                quantity: quantity
            })

            res.status(200).end()
        }
        catch{
            res.status(500).json({message: 'Internal server error'})
        }
    }

    public async getProductsOnCart(req: Request,res: Response){
        try{
            const verifyToken = verifyTokenUser.execute(req,res)
            const id = verifyToken.userId || 0
            
            if(!verifyToken.auth){
                return
            }

            const limit = Number(req.query.limit) < 10 ? Number(req.query.limit) : 10
            const page = Number(req.query.page) || 1

            const productsOnCart = await Cart.findAll({
                where: {
                  userId: id                
                },
                offset: page * limit - limit,
                limit: limit
            })

            res.status(200).json(productsOnCart)
        }
        catch{
            res.status(500).json({message: 'Internal server error'})
        }
    }

    public async increaseQuantityOfProductOnCart(req: Request,res: Response){
        try{
            const verifyToken = verifyTokenUser.execute(req,res)
            const id = verifyToken.userId || 0
            
            if(!verifyToken.auth){
                return
            }

            const productId = req.params.id

            if(!Number(productId)){
                return res.status(400).json({message: 'Product id is not valid'})
            }

            const [getProduct,productOnCart] = await Promise.all([Product.findAll({
                where: {
                    id: productId
                }
            }), Cart.findAll({
                where: {
                    productId
                }
            })])

            if(!productOnCart.length){
                return res.status(404).json({message: 'Product not found on cart'})
            }

            if(productOnCart[0].dataValues.quantity + 1 > getProduct[0].dataValues.quantity){
                return res.status(409).json({message: `Error, quantity not must be than ${getProduct[0].dataValues.quantity}`})
            }

            await Cart.update({
                quantity: productOnCart[0].dataValues.quantity + 1
            },{
                where: {
                    productId
                }
            })

            res.status(200).end()
        }
        catch{
            res.status(500).json({message: 'Internal server error'})
        }
    }

    public async decreaseQuantityOfProductOnCart(req: Request,res: Response){
        try{
            const verifyToken = verifyTokenUser.execute(req,res)
            const id = verifyToken.userId || 0
            
            if(!verifyToken.auth){
                return
            }

            const productId = req.params.id

            if(!Number(productId)){
                return res.status(400).json({message: 'Product id is not valid'})
            }

            const [getProduct,productOnCart] = await Promise.all([Product.findAll({
                where: {
                    id: productId
                }
            }), Cart.findAll({
                where: {
                    productId
                }
            })])

            if(!productOnCart.length){
                return res.status(404).json({message: 'Product not found on cart'})
            }

            if(productOnCart[0].dataValues.quantity - 1 <= 0){
                return res.status(409).json({message: `Error, quantity must be than 1`})
            }

            await Cart.update({
                quantity: productOnCart[0].dataValues.quantity - 1
            },{
                where: {
                    productId
                }
            })

            res.status(200).end()
        }
        catch{
            res.status(500).json({message: 'Internal server error'})
        }
    }

    public async removeProductOnCart(req: Request,res: Response){
        try{
            const verifyToken = verifyTokenUser.execute(req,res)
            const id = verifyToken.userId || 0
            
            if(!verifyToken.auth){
                return
            }

            const productId = req.params.id

            if(!Number(productId)){
                return res.status(400).json({message: 'Product id is not valid'})
            }

            const productOnCart = await Cart.findAll({
                where: {
                    productId
                }
            })

            if(!productOnCart.length){
                return res.status(404).json({message: 'Product not found on cart'})
            }

            await Cart.destroy({
                where: {
                    productId
                }
            })

            res.status(200).end()

        }
        catch{
            res.status(500).json({message: 'Internal server error'})
        }
    }
}

export default new UserActionsCartController