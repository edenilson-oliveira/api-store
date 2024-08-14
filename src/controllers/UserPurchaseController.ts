import { Request, Response } from 'express';
import { Op } from 'sequelize'
import verifyTokenUser from '../authentication/VerifyToken';
import Cart from '../database/models/cart';
import Orders from '../database/models/orders';
import Product from '../database/models/product';
import OrdersProducts from '../database/models/ordersProducts';

class UserPurchaseController{
    public async addOrder(req: Request,res: Response){
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

            const product = await Product.findAll({
                where: {
                    id: productId
                }
            })

            if(quantity > product[0].dataValues.quantity){
                return res.status(400).json({message: `Error, quantity not must be than ${product[0].dataValues.quantity}`})
            }

            
            const newOrder = await Orders.create({
                userId: id,
                price: product[0].dataValues.price * quantity,
                status: 'pending'
            })

            await OrdersProducts.create({
                orderId: newOrder.dataValues.id,
                productId: product[0].dataValues.id,
                quantity: quantity,
                price: product[0].dataValues.quantity * quantity
            })


            res.status(200).end()

        }
        catch{
            res.status(500).json({message: 'Internal server error'})
        }
    }

    public async addOrderOfProductsOnCart(req: Request,res: Response){
        try{
            const verifyToken = verifyTokenUser.execute(req,res)
            const id = verifyToken.userId || 0
            
            if(!verifyToken.auth){
                return
            }

            const productsOnCart = await Cart.findAll({
                where: {
                    userId: id
                }
            })

            if(!productsOnCart.length){
                return res.status(200).json({message: 'The cart is empty'})
            }

            let priceTotal = 0
            let products: any[] = []
            await Promise.all(productsOnCart.map(async (value: Cart) => {
                const [getProducts] = await Product.findAll({
                    where: {
                        id: value.dataValues.productId
                    }
                })

                priceTotal += getProducts.dataValues.price * value.dataValues.quantity

                products.push(getProducts)
                
            }))

            
            const newOrder = await Orders.create({
                userId: id,
                price: priceTotal,
                status: 'pending'
            })

            await Promise.all(products.map(async(value: Product,index: number) => {
                await OrdersProducts.create({
                    orderId: newOrder.dataValues.id,
                    productId: value.dataValues.id,
                    quantity: productsOnCart[index].dataValues.quantity,
                    price: value.dataValues.price * productsOnCart[index].dataValues.quantity
                })
            }))


            res.status(200).end()

        }
        catch{
            res.status(500).json({message: 'Internal server error'})
        }
    }

    public async removeOrder(req: Request,res: Response){
        try{
            const verifyToken = verifyTokenUser.execute(req,res)
            const id = verifyToken.userId || 0
            
            if(!verifyToken.auth){
                return
            }

            const orderId = req.params.id

            if(!Number(orderId)){
                return res.status(400).json({message: 'Error, orderId is not valid'})
            }

            const getOrder = await Orders.findAll({
                where: {
                    id: orderId,
                    status: 'pending',
                    userId: id
                }
            })

            if(!getOrder.length){
                return res.status(404).json({message: 'Order not found'})
            }

            await Promise.all([Orders.destroy({
                where: {
                    id: orderId
                }
            }), OrdersProducts.destroy({
                where: {
                    orderId
                }
            })])

            res.status(200).end()
        }
        catch{
            res.status(500).json({message: 'Internal server error'})
        }
    }

    public async getOrders(req: Request,res: Response){
        try{
            const verifyToken = verifyTokenUser.execute(req,res)
            const id = verifyToken.userId || 0
            
            if(!verifyToken.auth){
                return
            }

            const limit = Number(req.query.limit) < 10 ? Number(req.query.limit) : 10
            const page = Number(req.query.page) || 1
            const orderId = Number(req.query.orderId) || 0
            const status = req.query.status
            
            if(status !== 'pending' && status !== 'finish'){
                return res.status(400).json({message: 'Error, status param must be "pending" or "finish"'})
            }

            const getOrder = await Orders.findAll({
                attributes: ['id'],
                where: {
                    id: orderId ? orderId : { [Op.gt]: 0 },
                    userId: id,
                    status
                }
            })

            if(!getOrder.length){
                return res.status(404).json({message: 'Order not Found'})
            }

            const returnOrdersId = getOrder.map((value: Orders) => {
                return value.dataValues.id
            })

            const getOrdersProducts = await OrdersProducts.findAll({
                where: {
                    orderId: { [Op.or]: returnOrdersId }
                },
                offset: page * limit - limit,
                limit
            })

            const ordersProductsCount = await OrdersProducts.count({
                where: {
                    orderId: { [Op.or]: returnOrdersId }
                }
            })

            const pagination = {
                totalResults: getOrdersProducts.length,
                ordersProductsCount
            }


            res.status(200).json({getOrdersProducts,pagination})
        }
        catch{
            res.status(500).json({message: 'Internal server error'})
        }
    }

    public async removeProductOnOrder(req: Request,res: Response){
        try{
            const verifyToken = verifyTokenUser.execute(req,res)
            const id = verifyToken.userId || 0
            
            if(!verifyToken.auth){
                return
            }

            const orderProductId = req.params.id

            const getOrderProduct = await OrdersProducts.findAll({
                attributes: ['orderId'],
                where: {
                    id: orderProductId
                }
            })

            const getOrder = await Orders.findAll({
                where: {
                    id: getOrderProduct ? getOrderProduct[0].dataValues.orderId : 0,
                    userId: id
                }
            })

            if(!getOrder.length){
                return res.status(404).json({message: 'Order id of product not found'})
            }

            res.status(200).end()
        }
        catch{
            res.status(500).json({message: 'Internal server error'})
        }
    }


    public async finalizeOrder(req: Request,res: Response){
        try{
            const verifyToken = verifyTokenUser.execute(req,res)
            const id = verifyToken.userId || 0
            
            if(!verifyToken.auth){
                return
            }

            const orderId = Number(req.params.id)

            const getOrder = await Orders.findAll({
                attributes: ['id'],
                where: {
                    id: orderId,
                    userId: id,
                    status: 'pending'
                }
            })
            
            if(!getOrder.length){
                return res.status(404).json({message: 'Order not found'})
            }

            res.status(200).end()

        }
        catch{
            res.status(500).json({message: 'Internal server error'})
        }
    }
}

export default new UserPurchaseController