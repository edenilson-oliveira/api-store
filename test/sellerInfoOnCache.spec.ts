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
    
    expect(getSellerInfo[0]).toHaveProperty('id',0)
    expect(getSellerInfo[0]).toHaveProperty('email','teste@example.com')
    expect(getSellerInfo[0]).toHaveProperty('phone','123456789')
  })
  
})