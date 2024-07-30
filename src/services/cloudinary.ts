import { UploadApiOptions,UploadApiResponse } from 'cloudinary';
import cloudinary from '../config/cloudinaryConfig';

class Cloudinary{
  public async uploadImage(imagePath: string): Promise<UploadApiResponse | never>{
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
      throw new Error(error.error)
    }
  }
  public async deleteImage(publicId: string){
    const responseDelete = await cloudinary.api.delete_resources([publicId], 
      { type: 'upload', resource_type: 'image' })
    .then((response: any) => response)

    return responseDelete
  }

  public async searchImage(publicId: string): Promise<UploadApiResponse>{
    const search = await cloudinary.search
    .expression(publicId)
    .execute()

    return search
  }
}

export default new Cloudinary