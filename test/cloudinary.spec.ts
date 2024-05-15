import cloudinary from '../src/services/cloudinary';

describe('Test of upload with cloudinary', () => {
  it('should upload image with sucess', async () => {
    const upload = await cloudinary.uploadImage('/data/data/com.termux/files/home/projects/api-store/test/node-js-image-test.png')
    
    expect(upload).toBeDefined()
  })
})