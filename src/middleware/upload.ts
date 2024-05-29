import multer from 'multer';
import { Request } from 'express'

const upload: any = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req: Request,file: any) => {
    console.log(file.originalname)
  }
}).array('images');


export default upload