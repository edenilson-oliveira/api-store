import VerifySellerAccount from '../src/repository/VerifySellerAccountInfo'
import client from '../src/redisConfig'

describe('Test verify seller account info', () => {
  
  afterAll( async () => {
    await client.del('user-seller-info')
    
    client.quit()
  })
  
  
  beforeAll(async () => {
    await client.set('user-seller-info',JSON.stringify([{id: 1,email: 'teste@example.com', phone: '123456789'}]))
  })
    
  it('should return sucess in verify of id', async () => {
    const verifySellerAccount = new VerifySellerAccount()
      
    const verify = await verifySellerAccount.verifyIdSeler(0)
      
    expect(verify).toBeUndefined()
  })
  
  it('should return error in verify of id', async () => {
    const verifySellerAccount = new VerifySellerAccount()
      
    const verify = await verifySellerAccount.verifyIdSeler(1)
      
    expect(verify).toBeDefined()
  })
    
  it('should return sucess in verify of email', async () => {
    const verifySellerAccount = new VerifySellerAccount()
      
    const verify = await verifySellerAccount.verifyEmailSeler('teste1@example.com')  
  
    expect(verify).toBeUndefined()
  })
  
  it('should return error in verify of email', async () => {
    const verifySellerAccount = new VerifySellerAccount()
      
    const verify = await verifySellerAccount.verifyEmailSeler('teste@example.com')  
  
    expect(verify).toBeDefined()
    expect(verify).toMatch(/Email/)
  })
    
  it('should return success in verify of phone number', async () => {
    const verifySellerAccount = new VerifySellerAccount()
      
    const verify = await verifySellerAccount.verifyPhoneSeler('12345678910')
    
    expect(verify).toBeUndefined()
  })  
    
  it('should return error in verify of phone number', async () => {
    const verifySellerAccount = new VerifySellerAccount()
      
    const verify = await verifySellerAccount.verifyPhoneSeler('123456789')
    
    expect(verify).toBeDefined()
    expect(verify).toMatch(/Phone/)
  })
})