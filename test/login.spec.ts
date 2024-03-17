import request from 'supertest';
import { App } from '../src/app';
import client from '../src/redisConfig'

describe('Tests of routes login', () => {
  
  const app = new App().server
  afterAll(() => {
    client.quit()
  })

  it('should send code to create user', async () => {
    
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      password: '12345678',
      email: 'teste@gmail.com'
    }
    
    const res = await request(app)
    .post('/users/sign-up')
    .send(data)
    
    expect(res.statusCode).toBe(200)
  }),
})