import InfoSalesVerify from '../src/repository/InfoSalesVerify'
import client from '../src/redisConfig'

describe('Test of info sales verify get info cache', () => {
  
  afterAll(() => {
    client.quit()
  })
  
  it('should return array of users', () => {
    const verify = new InfoSalesVerify(41,'teste@example.com','123456789').getInfoOnCache()
    
    expect(verify).toBeTruthy()
  })
  
})