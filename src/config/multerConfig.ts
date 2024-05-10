import multer from 'multer';
import crypto from 'crypto'

class MulterConfig{
  public storage: string
  
  constructor(){
    this.storage = multer.diskStorage({
      destination:
      filename(request,file,callback){
        const hash = crypto.randomBytes(6).toString('hex')
        
        callback(null, hash)
      }
    })
  }
}

export default new MulterConfig