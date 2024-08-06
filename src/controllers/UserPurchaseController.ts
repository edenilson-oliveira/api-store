import { Request, Response } from 'express';
import verifyTokenUser from '../authentication/VerifyToken';
import Cart from '../database/models/cart';
import Shopping from '../database/models/shopping';
import Product from '../database/models/product';
import PurchasedItems from '../database/models/purchasedItems';

class UserPurchaseController{
    public async createOrder(req: Request,res: Response){
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

            
            const newPurchase = await Shopping.create({
                userId: id,
                price: priceTotal,
                status: 'pending'
            })

            await Promise.all(products.map(async(value: Product,index: number) => {
                await PurchasedItems.create({
                    purchaseId: newPurchase.dataValues.id,
                    productId: value.dataValues.id,
                    quantity: productsOnCart[index].dataValues.quantity,
                    price: value.dataValues.price
                })
            }))


            res.status(200).end()

        }
        catch{
            res.status(500).json({message: 'Internal server error'})
        }
    }
}

export default new UserPurchaseController