import request from 'supertest';
import { App } from '../src/app';
import client from '../src/redisConfig'

describe('Tests of refresh token', () => {
  
  const app = new App().server
  afterAll(() => {
    client.quit()
  })

  it('should return token after refresh token', async () => {

    const res = await request(app)
    .get('/refreshToken')
    .set('Cookie', [
    'refreshToken=token', 
    ])
    
    expect(res.statusCode).toBe(200)
  })
})
