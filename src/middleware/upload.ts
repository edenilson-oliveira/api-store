import multer, { Options,FileFilterCallback } from 'multer';
import { Request,Response,NextFunction,Express } from 'express';

const configMulter = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024,
    files: 5
   },
  fileFilter: (req: Request,file: Express.Multer.File,callback: FileFilterCallback) => {
   // console.log(req.file,file,file.originalname)
    const getExtensionFile = file.originalname.slice(file.originalname.length-4,file.originalname.length)
    
    const verifyFileExtension = getExtensionFile === '.png'|| getExtensionFile === '.jpg'
    
    if(!file){
      return callback(new Error('file not found')) 
    }

    if(!verifyFileExtension){
      return callback(new Error('Error the file extension is not valid'))
    }
    
    callback(null,true)
  }
})


const upload = (req: Request, res: Response,next: NextFunction) => {
  
  const uploadMulter = configMulter.array('images')
  uploadMulter(req,res,(err: any) => {
    if(err){
      return res.status(400).json({message: err.message})
    }
    next()
  })
}

export default configMulter