import { UploadApiOptions } from 'cloudinary';
import cloudinary from '../config/cloudinaryConfig';

class Cloudinary{
  public async uploadImage(imagePath: string){
    const options: UploadApiOptions = {
      use_filename: true,
      unique_filename: true,
      overwrite: true,
      width: 900,
      height: 500,
    };

    try {
      const result = await cloudinary.uploader.upload(imagePath, options);
      console.log(result)
      return result 
      
    } catch (error: any) {
      
      throw error.error
    }
  }
  public async deleteImage(publicId: string){
    cloudinary.uploader.destroy( publicId , function (resultado) { console.log(resultado) });
  }
}

export default new Cloudinary