import request from 'supertest';
import { App } from '../src/app';
import client from '../src/redisConfig'

describe('Tests of routes login', () => {
  
  const app = new App().server
  afterAll(() => {
    client.quit()
  })

  it('should send code to create user', async () => {
    
    const requests = []
    
    for(let i = 0; i < 10000; i++){
      requests.push(request(app)
      .patch('/users/account')
      .send({}))
    }
    
    const res = await Promise.all(requests)
    
    res.forEach(value => {
      expect(value.statusCode).toBe(503)
    })
    
    
    
  })
})