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
      return result 
      
    } catch (error: any) {
      return error.error[0]
    }
  }
  public async deleteImage(publicId: string){
    const responseDelete = await cloudinary.api.delete_resources([publicId], 
      { type: 'upload', resource_type: 'image' })
    .then((response: any) => response)

    return responseDelete
  }

  public async searchImage(publicId: string){
    const search = await cloudinary.search
    .expression(publicId)
    .execute()

    return search
  }
}

export default new Cloudinary