class ValidateSellerAccountInfo{
  
  public validateEmail(email: string): boolean{
    const regexValidateEmail = /^[a-z0-9/./_/-]+@[a-z]+(\.[a-z]+){1,}$/
    
    return Boolean(regexValidateEmail.exec(email))
  }
  
  public validatePhone(phone: string): boolean{
    const regexValidatePhone = /[+]{1}[0-9]{13}$/
    
    return Boolean(regexValidatePhone.exec(phone))
  }
  
  private validateLength(info:string ,propertyName: string,InfoLength:number){
    if(info.length > InfoLength){
      throw new Error(`The ${propertyName} cannot be longer than ${InfoLength} characters`)
      }
    }
    
  public validateInfoAboutStore(name:string ,description: string,category:string, status: any): void | string  {
    try{
      
      if(!name || !status){
      throw new Error('Error name and status infos are required')
      }
      
      this.validateLength(name, 'name', 15)
      this.validateLength(description, 'description', 120)
      this.validateLength(category, 'category', 20)
      
      if(typeof status !== 'boolean'){
        throw new Error('The status property must be of boolean type, true or false')
      }
    }
    catch(err: any){
      return err.message
    }
  }
}

export default ValidateSellerAccountInfo