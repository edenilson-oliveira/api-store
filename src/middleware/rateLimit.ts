import { Request,Response,NextFunction} from 'express';

import verifyToken from '../authentication/VerifyToken'; 
import client from '../redisConfig'

const rateLimit = (resource: string, limit=10, auth?: boolean) => async (req: Request,res: Response,next: NextFunction) => {
  
  let id: number = 0
  if(auth){
    const verifyTokenUser = verifyToken.getTokenOnly(req,res)
    id = Number(verifyTokenUser.id)
    
  }
  
  const userId = id || req.ip
  const key = `rate-limit-${resource}-${userId}`
  const requestCount = await client.get(key) || 0
  
  const newRequestCount = await client.set(key, Number(requestCount) + 1)
  res.set({
    'X-RateLimit-Limit': limit,
    'X-RateLimit-Remaining': Number(requestCount) >= limit ? 0 : limit - Number(requestCount) 
  })
  if(requestCount && Number(requestCount) > limit){
    res.status(429).json({message: 'Error rate-limit'})
    return client.expire(key, 60)
  }
  next()
}

export default rateLimit