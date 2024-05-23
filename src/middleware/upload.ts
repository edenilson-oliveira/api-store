import { Request,Response } from 'express';
import multer from 'multer'
import cloudinary from '../services/cloudinary';

class Upload{
  public execute(req: Request,file: any){
    const storage = multer.memoryStorage()
    const upload = multer({ storage })
    
    fileSize: 5 * 1024 * 1024
    
  }
}