import InfoSalesVerify from '../src/repository/InfoSalesVerify'
import client from '../src/redisConfig'

describe('Test of get info sales cache', () => {
  
  afterAll(() => {
    client.quit()
  })
  
  beforeAll(async () => {
    await client.set('user-sales-info',JSON.stringify([{id: 1,email: 'teste@example.com', phone: '123456789'}]))
  })
  
  describe('Test of get sales account info on cache', () => {
    it('should return array of users', async () => {
      
      const infoSalesVerify = new InfoSalesVerify(1,'teste@example.com','123456789')
      const infoOnCache = await infoSalesVerify.getInfoOnCache()
      
      expect(infoOnCache).toBeTruthy()
    })
    
    it('should return false', async () => {
      
      const infoSalesVerify = new InfoSalesVerify(10,'teste@example.com','123456789')
      const infoOnCache = await infoSalesVerify.getInfoOnCache()
      
      expect(infoOnCache).toBeFalsy()
    })
  })


  describe('Test of info sales verify', () => {
    it('should return sucess in verify of info users', async () => {
      const infoSalesVerify = new InfoSalesVerify(10,'teste1@example.com','12345678910')
      
      const verify = await infoSalesVerify.verifyInfoUser()
      
      expect(verify).toBeFalsy()
    })
    
    it('should return error in verify of id', async () => {
      const infoSalesVerify = new InfoSalesVerify(2,'teste1@example.com','12345678910')
      
      const verify = await infoSalesVerify.verifyInfoUser()
      
      expect(verify.message).toBe('Your account sales already exist')
    })
    
    it('should return error in verify of email', async () => {
      const infoSalesVerify = new InfoSalesVerify(1,'teste@example.com','12345678910')
      
      const verify = await infoSalesVerify.verifyInfoUser()
      
      expect(verify.message).toMatch(/Email/)
    })
  })
  
})