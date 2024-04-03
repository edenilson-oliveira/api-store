import VerifySellerAccountInfo from '../src/repository/VerifySellerAccountInfo'
import client from '../src/redisConfig'

describe('Test of get info sales cache', () => {
  
  afterAll(() => {
    client.quit()
  })
  
  beforeAll(async () => {
    await client.set('user-seller-info',JSON.stringify([{id: 1,email: 'teste@example.com', phone: '123456789'}]))
  })
  
  describe('Test of get sales account info on cache', () => {
    it('should return array of users', async () => {
      
      const verifySellerAccount = new VerifySellerAccountInfo(1,'teste@example.com','123456789')
      const infoOnCache = await verifySellerAccount.getInfoOnCache()
      
      expect(infoOnCache).toBeTruthy()
    })
    
    it('should return false', async () => {
      
      await client.del('user-seller-info')
      const verifySellerAccount = new VerifySellerAccountInfo(10,'teste@example.com','123456789')
      const infoOnCache = await verifySellerAccount.getInfoOnCache()
      
      expect(infoOnCache).toBeFalsy()
    })
  })


  describe('Test of info sales verify', () => {
    
    beforeAll(async () => {
    await client.set('user-seller-info',JSON.stringify([{id: 1,email: 'teste@example.com', phone: '123456789'}]))
  })
    
    it('should return sucess in verify of info users', async () => {
      const verifySellerAccount = new VerifySellerAccountInfo(10,'teste1@example.com','12345678910')
      
      const verify = await verifySellerAccount.verifyInfoSeller()
      
      expect(verify).toBeFalsy()
    })
    
    it('should return error in verify of id', async () => {
      const verifySellerAccount = new VerifySellerAccountInfo(1,'teste1@example.com','12345678910')
      
      const verify = await verifySellerAccount.verifyInfoSeller()
      
      expect(verify.message).toBe('Your account seller already exist')
    })
    
    it('should return error in verify of email', async () => {
      const verifySellerAccount = new VerifySellerAccountInfo(2,'teste@example.com','12345678910')
      
      const verify = await verifySellerAccount.verifyInfoSeller()
      
      expect(verify.message).toMatch(/Email/)
    })
    
    it('should return error in verify of phone number', async () => {
      const verifySellerAccount = new VerifySellerAccountInfo(2,'teste1@example.com','123456789')
      
      const verify = await verifySellerAccount.verifyInfoSeller()
      
      expect(verify.message).toMatch(/Phone/)
    })
    
  })
  
})