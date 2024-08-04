import { Request, Response } from "express";
import verifyTokenUser from '../authentication/VerifyToken';
import Cart from '../database/models/cart';

class UserPurchaseController{
    public async finalizeOrder(req: Request,res: Response){
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

            res.status(200).json({productsOnCart})

        }
        catch{
            res.status(500).json({message: 'Internal server error'})
        }
    }
}

export default new UserPurchaseController