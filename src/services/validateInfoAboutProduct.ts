class ValidateInfoAboutProduct{
  private verifyValueExistAndLength(value: string | number,valueName:string,valueLengthMax?: number): never | undefined{
    if(!value){
      throw new Error(`Error ${valueName} is required`)
    }
    if(valueLengthMax && value.toString().length >= valueLengthMax){
      throw new Error(`Error the ${valueName} cannot be longer than ${valueLengthMax} characters`)
    }
  }
  
  private verifyIsNumber(value: string,valueName: string){
    const verify = Number(value)
    if(verify != 0 && !verify)
    throw new Error(`Error ${valueName} is not a number`)
  }
  
  public validateAllInfo(name: string,price: string,quantity: string,discount: string,description: string): string | undefined{
    try{
      this.verifyValueExistAndLength(name,'name',100)
      this.verifyValueExistAndLength(description,'description',200)
      
      this.verifyIsNumber(price,'price')
      this.verifyIsNumber(quantity,'quantity')
      this.verifyIsNumber(discount,'discount')
    }
    catch(err: any){
      return err.message
    }
  }
}

export default ValidateInfoAboutProduct