import { Request,Response,NextFunction } from 'express';

interface Validate{
  isValidate: boolean;
  message?: string;
}

class Validator{
  public execute(req: Request,res: Response): Readonly<Validate>{
    
    const {firstName,lastName,email,password} = req.body
    
    const validateName = /^[A-Za-zÀ-ÖØ-öø-ÿ ']+$/
    const validateEmail = /^[a-z0-9]+@[a-z]+(\.[a-z]+){1,}$/
    
    try{
      if(!(firstName && lastName && validateName.exec(firstName) && validateName.exec(lastName))){
        throw 'Firstname or lastName are erro'
      }
     
     if(!(email && validateEmail.exec(email))){
       throw 'Email is not valid'
     }
     if(!(password.length >= 8)){
       throw 'Password must be at least 8 characters long'
     }
     
     return {isValidate: true}
     }
    catch(err){
      return {isValidate: false,message:err as string}
      
    }
  }
}

const validator = new Validator()

export default validator