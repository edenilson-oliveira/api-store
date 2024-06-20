import { UploadApiOptions } from 'cloudinary';
import cloudinary from '../config/cloudinaryConfig';

class Cloudinary{
  public async uploadImage(imagePath: string, public_id: string){
    const options: UploadApiOptions = {
      use_filename: true,
      unique_filename: true,
      overwrite: true,
      width: 900,
      height: 500,
      public_id
    };

    try {
      const result = await cloudinary.uploader.upload(imagePath, options);
      return result 
      
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Cloudinary