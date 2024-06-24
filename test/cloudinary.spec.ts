import cloudinary from '../src/services/cloudinary';

describe('Test of upload with cloudinary', () => {
  it('should upload image with sucess', async () => {
    const upload = await cloudinary.uploadImage('path')
    
    expect(upload).toBeDefined()
  })
})