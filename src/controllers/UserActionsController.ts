import { Request,Response,NextFunction } from 'express';
import verifyTokenUser from "../authentication/VerifyToken"

class UserActionsController{
    public async addProductOnCart(req: Request,res: Response){
        const verifyToken = verifyTokenUser.execute(req,res)
        const id = verifyToken.userId || 0
          
        if(!verifyToken.auth){
            return
        }
    }
}