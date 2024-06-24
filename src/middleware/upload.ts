import { Request,Response,NextFunction } from 'express';
import upload from './multer';
import client from '../redisConfig';
import verifyToken from '../authentication/VerifyToken'

const uploadValidate = async (req: Request, res: Response, next: NextFunction) => {

    verifyToken.TokenOnBearerHeader(req.headers)
    const { token } = verifyToken.getBearerHeaderData()
    const verifyTokenUser = verifyToken.getTokenOnly(token)
    const id = Number(verifyTokenUser.id)

    if(!id){
        return next()
    }
    
    const files = await upload.array('images')(req,res,async (err) => {
        if(err){
            return res.status(400).json({message: err.message})
        }
        
        await client.set(`files-images-product-${id}`,JSON.stringify(req.files))   
        next()
    })
        
}

export default uploadValidate