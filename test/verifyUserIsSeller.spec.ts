import VerifyUserIsSeller from '../src/repository/VerifyUserIsSeller';
import client from '../src/redisConfig'

describe('Test of verify user is seller', () => {
  
  afterAll( async () => {
    await client.del('user-seller-info')
    
    client.quit()
  })
  
  beforeAll(async () => {
    await client.set('user-seller-info',JSON.stringify([{id: 0,email: 'teste@example.com', phone: '123456789'}]))
  })
  
  it('should return true', async () => {
    const verifyUserIsSeller = new VerifyUserIsSeller(0)
    
    const verify = await verifyUserIsSeller.execute()
    
    expect(verify).toBeTruthy()
  })
  
  
  it('should return error message', async () => {
    const verifyUserIsSeller = new VerifyUserIsSeller(-1)
    
    const verify = await verifyUserIsSeller.execute()
    
    expect(verify).toBe('This account is not seller')
  })
})