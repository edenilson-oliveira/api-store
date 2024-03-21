import request from 'supertest';
import { App } from '../src/app';
import client from '../src/redisConfig';
import { Request,Response } from 'express';

describe('Tests of routes token', () => {
  
  const app = new App().server
  afterAll(() => {
    client.quit()
  })

  it('should return token after refresh token', async () => {

    const res = await request(app)
    .get('/refreshToken')
    .set('Cookie', [
    'refreshToken=', 
    ])
    
    expect(res.statusCode).toBe(401)
  })
})