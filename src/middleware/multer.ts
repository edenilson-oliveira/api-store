import multer, { FileFilterCallback, diskStorage } from 'multer';
import { Request,Response,NextFunction,Express } from 'express';
import { v4  as  uuidv4 }   from 'uuid';

const storage = multer.diskStorage({
  filename: (req: Request, file:Express.Multer.File,  callback: any ) => {
    callback(null,`${uuidv4()}-${Date.now()}`)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  },
  fileFilter(req: Request, file:Express.Multer.File, callback: FileFilterCallback) {
    if(!(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')){
      callback(new Error('File extension is not valid'))
    }
    callback(null, true)
  },
})

export default upload