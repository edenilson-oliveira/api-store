import cloudinary from '../src/services/cloudinary';

describe('Test of upload with cloudinary', () => {
  it('should upload image with sucess', async () => {
    const upload = await cloudinary.uploadImage('test/node-js-image-test.png')
    console.log(upload)
    expect(upload).toBeDefined()
  })

  it('should return error on upload image with sucess', async () => {
    const upload = await cloudinary.uploadImage('path')
    console.log(upload)
    //
    expect(upload).toMatch(/Error/)
  })
  
  it('should return info about image when search', async () => {
    const searchImage = await cloudinary.searchImage('node-js-image-test')
    
    expect(searchImage).toHaveProperty('resources')
    expect(searchImage.resources[0]).toHaveProperty('public_id')
    expect(searchImage.resources[0]).toBeDefined()
    
  })
  
  it('should return resources with no any info about image when search', async () => {
    const searchImage = await cloudinary.searchImage('path')
    
    expect(searchImage).toHaveProperty('resources')
    expect(searchImage.resources[0]).toBeUndefined()
  })
  
  it('should return deleted when delete image', async () => {
    const searchImage = await cloudinary.searchImage('node-js-image-test')
    const deleteImage = await cloudinary.deleteImage(searchImage.resources[0].public_id)

    expect(deleteImage).toBeDefined()
    expect(deleteImage.deleted).toHaveProperty(searchImage.resources[0].public_id,'deleted')
  })
  
  it('should return not found when delete image', async () => {
    const deleteImage = await cloudinary.deleteImage('node-js-image-test')

    console.log(deleteImage)
    expect(deleteImage).toBeUndefined()
  })
  
})