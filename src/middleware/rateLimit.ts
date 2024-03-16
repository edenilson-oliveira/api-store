import { Request,Response,NextFunction} from 'express';

import client from '../redisConfig'

const rateLimit = (resource: string, limit=10) => async (req: Request,res: Response,next: NextFunction) => {
  const userIp = req.ip
  const key = `rate-limit-${resource}-${userIp}`
  const requestCount = await client.get(key) || 0
  
  const newRequestCount = await client.set(key, Number(requestCount || 0) + 1)
  res.set({
    'X-RateLimit-Limit': limit,
    'X-RateLimit-Remaining': Number(requestCount) >= limit ? 0 : limit - Number(requestCount) 
  })
  if(requestCount && Number(requestCount) > limit){
    res.status(429).json({message: 'Error rate-limit'})
    client.expire(key, 60)
  }
  next()
}

export default rateLimit