import { Request,Response,NextFunction } from 'express';
import toobusy from 'toobusy-js';

export default async function(req: Request,res: Response,next: NextFunction){
  if(toobusy()){
    return res.status(503).json({message: 'Server too busy'})
  }
  next()
}