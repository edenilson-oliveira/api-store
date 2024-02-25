import { Request,Response,NextFunction } from 'express';

class Validator{
  public execute(req: Request,res: Response,next: NextFunction){
    
    const {firstName,lastName,email,password} = req.body
    
    const validateName = /^[A-Za-zÀ-ÖØ-öø-ÿ ']+$/
    const validateEmail = /^[a-z]+@[a-z]+(\.[a-z]+){1,}$/
    
    try{
      if(!(firstName && lastName && validateName.exec(firstName) && validateName.exec(lastName))){
        throw new Error('Firstname or lastName are error')
      }
     
     if(!(email && validateEmail.exec(email))){
       throw new Error('Email is not invalid')
     }
     if(!(password.length >= 8)){
       throw new Error('Password must be at least 8 characters long')
     }
     
    next()
     }
    catch(err){
      res.status(401).json({message: err})
      
    }
  }
}

const validator = new Validator()

export default validator