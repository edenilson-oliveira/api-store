import multer, { Options,FileFilterCallback } from 'multer';
import { Request,Express } from 'express'

const configMulter = {
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req: Request,file: Express.Multer.File,callback: FileFilterCallback) => {
    
    const getExtensionFile= file.originalname.slice(file.originalname.length-4,file.originalname.length)
    if(getExtensionFile === '.png' || getExtensionFile === '.jpg'){
      return callback(null,true)
    }
  }
}

const upload = multer(configMulter)

export default upload