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
    'refreshToken=eyJhbGciOiJIUzI1NilsInR5cCI6Ikp XVCJ9.eyJpZCI6MTQsImlhdCI6MTcxMDI5NTE2 NCwiZXhwljoxNzExNTkxMTY0fQ.SOrXRR66Fxm -D_atY580501dfl-HLX8p7rn5XZQ6yR8', 
    ])
    
    expect(res.statusCode).toBe(200)
  })
})
