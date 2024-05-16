import { multer,StorageEngine,Multer } from 'multer';

class MulterConfig{
  private storage: StorageEngine
  private upload: Multer
  
  constructor(){
    this.storage = multer.memoryStorage();
    this.upload = multer({ this.storage })
  }
  
  public getUpload(): Multer{
    return this.upload.single(req,res)
  }
}

export default new MulterConfig