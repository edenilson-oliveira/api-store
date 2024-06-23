import { Request,Response,NextFunction } from 'express';
import upload from './multer';
import client from '../redisConfig';
import verifyToken from '../authentication/VerifyToken'

const uploadValidate = async (req: Request, res: Response, next: NextFunction) => {

    const files = await upload.array('images')(req,res,(err) => {
        if(err){
            return res.status(400).json({message: err.message})
        }

        verifyToken.TokenOnBearerHeader(req.headers)
        const { token } = verifyToken.getBearerHeaderData()
        const verifyTokenUser = verifyToken.getTokenOnly(token)
        const id = Number(verifyTokenUser.id)
        
        id ? client.set(`files-images-product-${id}`,JSON.stringify(req.files)):false
        next()
    })
        
}

export default uploadValidate