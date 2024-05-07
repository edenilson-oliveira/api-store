class ValidateInfoAboutProduct{
  
  private verifyValueExistAndLength(value: string | number,valueName:string,valueLengthMax?: number): never | undefined{
    if(!value){
      throw new Error(`Error ${valueName} is required`)
    }
    if(valueLengthMax && value.toString().length >= valueLengthMax){
      throw new Error(`Error the ${valueName} cannot be longer than ${valueLengthMax} characters`)
    }
  }
  
  public validateAllInfo(name: string,price: number,quantity: number,discount: number,description: string): string | undefined{
    try{
      this.verifyValueExistAndLength(name,'name',100)
      this.verifyValueExistAndLength(price,'price')
      this.verifyValueExistAndLength(quantity,'quantity')
      this.verifyValueExistAndLength(description,'description',200)
    }
    catch(err: any){
      return err.message
    }
  }
}

export default ValidateInfoAboutProduct