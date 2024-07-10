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
  it('should return undefined when delete image', async () => {
    const deleteImage = await cloudinary.deleteImage('path')

    console.log(deleteImage)
    expect(deleteImage).toBeDefined()
  })

  it('should return info about image when search', async () => {
    const searchImage = await cloudinary.searchImage('public_id')

    expect(searchImage).toHaveProperty('resources')
    expect(searchImage.resources[0]).toHaveProperty('public_id')

  })

  it('should return resources with no any info about image when search', async () => {
    const searchImage = await cloudinary.searchImage('public_id')

    expect(searchImage).toHaveProperty('resources')
    expect(searchImage.resources[0]).toBeUndefined()
  })
    
})