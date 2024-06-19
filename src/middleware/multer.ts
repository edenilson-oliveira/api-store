import multer, { Options, diskStorage } from 'multer';
import { Request,Response,NextFunction,Express } from 'express';

const storage = multer.diskStorage({
  filename: (req: Request, file:Express.Multer.File,  callback: any ) => {
    callback(null,file.originalname)
  }
})

export default multer({ storage })