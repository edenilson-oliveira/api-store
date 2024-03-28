class ValidateInfos{
  name: string
  description: string
  category:string
  status: boolean
  
  constructor(name:string ,description: string,category:string, status: boolean){
    
    this.name = name,
    this.description = description,
    this.category = category,
    this.status = status
  }
  
  private validateLength(info:string ,propertyName: string,InfoLength:number){
    if(info.length > InfoLength){
      throw new Error(`The ${propertyName} cannot be longer than ${InfoLength} characters`)
      }
    }
    
  public execute(){
    try{
      this.validateLength(this.name, 'name', 15)
      this.validateLength(this.description, 'description', 120)
      this.validateLength(this.category, 'category', 20)
      return true
    }
    catch(err){
      return err as any
    }
  }
}

export default ValidateInfos