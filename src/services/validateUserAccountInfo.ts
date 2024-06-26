interface Validate{
  isValidate: boolean;
  message?: string;
}

interface UserInfo{
  firstName: string,
  lastName: string,
  email: string,
  password: string
}

class ValidateUserAccountInfo{
  user: UserInfo
  
  constructor(user: UserInfo){
    this.user =  user
  }
  
  public execute(): Readonly<Validate>{
    
    const {firstName,lastName,email,password} = this.user
    
    const validateName = /^[A-Za-zÀ-ÖØ-öø-ÿ ']{3,}$/
    const validateEmail =  /^[a-z0-9/./_/-]+@[a-z]+(\.[a-z]+){1,}$/
    
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

export default ValidateUserAccountInfo