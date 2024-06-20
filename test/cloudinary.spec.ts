import cloudinary from '../src/services/cloudinary';

describe('Test of upload with cloudinary', () => {
  it('should upload image with sucess', async () => {
    const upload = await cloudinary.uploadImage('/home/edenilson/projects/api-store/test/node-js-image-test.png', 'new-file')
    
    expect(upload).toBeDefined()
  })
})