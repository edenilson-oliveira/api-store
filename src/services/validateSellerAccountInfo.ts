class ValidateSellerAccountInfo{
  private name: string
  private description: string
  private category:string
  private status: boolean
  
  constructor(name:string ,description: string,category:string, status: any){
    
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
      
      if(!this.name || !this.status){
      throw new Error('Error name and status infos are required')
      }
      
      this.validateLength(this.name, 'name', 15)
      this.validateLength(this.description, 'description', 120)
      this.validateLength(this.category, 'category', 20)
      
      if(typeof this.status !== 'boolean'){
        throw new Error('The status property must be of boolean type')
      }
      
      return true
    }
    catch(err){
      return err as any
    }
  }
}

export default ValidateSellerAccountInfo