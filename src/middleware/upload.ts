import { Request,Response,NextFunction } from 'express';
import upload from './multer';

const uploadValidate = async (req: Request, res: Response, next: NextFunction) => {

    const files = await upload.array('images')(req,res,(err) => {
        if(err){
            return res.status(400).json({message: err.message})
        }    
        console.log(req.files)
        next()
    })
        
}

export default uploadValidate