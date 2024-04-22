import SellerInfoOnCache from '../src/repository/SellerInfoOnCache';
import client from '../src/redisConfig'

describe('Test of seller info on cache', () => {
  
  afterAll( async () => {
    await client.del('user-seller-info')
    
    client.quit()
  })
  
  it('should create new info on cache', async () => {
    const sellerInfo = new SellerInfoOnCache()
    
    const sellerInfoCreate = await sellerInfo.add({id: 0,email: 'teste@example.com',phone: '123456789'})
    
    
    expect(sellerInfoCreate).toBeUndefined()
    
  })
  
  it('should return seller info', async () => {
    const sellerInfo = new SellerInfoOnCache()
    
    const getSellerInfo = await sellerInfo.getInfo()
    
    const findById = getSellerInfo.map(value => {
      if(value.id === 0){
        return value
      }
    })
    
    expect(findById[0]).toHaveProperty('id',0)
    expect(findById[0]).toHaveProperty('email','teste@example.com')
    expect(findById[0]).toHaveProperty('phone','123456789')
  })
  
  it('should edit seller info', async () => {
    const sellerInfo = new SellerInfoOnCache()
    const dataEditSellerInfo = {id: 0,email: 'new.email@example.com',phone: ''}
    await sellerInfo.EditById(dataEditSellerInfo)
    
    const getSellerInfo = await sellerInfo.getInfo()
    
    const findByEmail = getSellerInfo.map(value => {
      if(dataEditSellerInfo.email === value.email){
        return value
      }
    })
    console.log(findByEmail)
    expect(findByEmail[0]).toHaveProperty('email','new.email@example.com')
    expect(findByEmail[0]).toHaveProperty('phone','123456789')
    
  })
  
})