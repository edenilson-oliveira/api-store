import { Request,Response,NextFunction } from 'express';
import upload from './multer';
import client from '../redisConfig';
import verifyToken from '../authentication/VerifyToken'

const uploadValidate = (resource: string) => async (req: Request, res: Response, next: NextFunction) => {

    verifyToken.TokenOnBearerHeader(req.headers)
    const { token } = verifyToken.getBearerHeaderData()
    const verifyTokenUser = verifyToken.getTokenOnly(token)
    const id = Number(verifyTokenUser.id)

    if(!id){
        return next()
    }

    if(!Number(req.params.id)){
        return next()
    }
    
    const files = await upload.array('images')(req,res,async (err) => {
        if(err){
            return res.status(400).json({message: err.message})
        }
        
        await client.set(`files-images-product-user-${req.params.id ? `${resource}-`:''}${id}`,JSON.stringify(req.files))
        client.expire(`files-images-product-user-${req.params.id ? `${resource}-`:''}${id}`, 60)
        next()
    })
        
}

export default uploadValidate