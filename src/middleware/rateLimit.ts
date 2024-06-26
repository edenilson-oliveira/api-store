import { Request,Response,NextFunction} from 'express';

import verifyToken from '../authentication/VerifyToken'; 
import client from '../redisConfig'

const rateLimit = (resource: string, limit=10,time=60) => async (req: Request,res: Response,next: NextFunction) => {
  verifyToken.TokenOnBearerHeader(req.headers)
  const { token } = verifyToken.getBearerHeaderData()
  const verifyTokenUser = verifyToken.getTokenOnly(token)
  const id = Number(verifyTokenUser.id)
  
  const userId = id || req.ip
  const key = `rate-limit-${resource}-${userId}`
  const requestCount = await client.get(key) || 0
  
  const newRequestCount = await client.set(key, Number(requestCount) + 1)
  res.set({
    'X-RateLimit-Limit': limit,
    'X-RateLimit-Remaining': Number(requestCount) >= limit ? 0 : limit - Number(requestCount) 
  })
  
  client.expire(key, time)
  
  if(requestCount && Number(requestCount) > limit){
    return res.status(429).json({message: 'Error rate-limit'})
  }
  next()
}

export default rateLimit