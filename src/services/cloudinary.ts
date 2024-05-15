import cloudinary from '../config/cloudinaryConfig';

class Cloudinary{
  public async uploadImage(imagePath: any){
    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    };

    try {
      const result = await cloudinary.uploader.upload(imagePath, options);
      console.log(result);
      return result.public_id;
      
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Cloudinary