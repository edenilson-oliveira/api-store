import client from '../redisConfig';

type UserSalesInfo = {
  id: number;
  email: string;
  phone: string;
}

class InfoSalesVerify{
  private readonly id: number
  private readonly  email: string
  private readonly phone: string
  
  constructor(id: number, email: string,phone: string){
    this.id = id,
    this.email = email,
    this.phone = phone
  }
  
  public async getInfoOnCache(){
    
    const userSalesInfo = await client.get('user-sales-info') || ''
    
    return userSalesInfo ? JSON.parse(userSalesInfo) : false
  }
  
  public async verifyInfoUser(){
    const userInfo = await this.getInfoOnCache()
    try{
      if(userInfo){
        userInfo.map((value: UserSalesInfo) => {
          
          if(this.id === value.id){
            throw new Error('Your account sales already exist')
          }
          if(this.email === value.email){
            throw new Error('Email sales already exist')
          }
          if(this.phone === value.phone){
            throw new Error('Phone number sales already exist')
          }
        })
        
        return
      }
      
      return false
    }
    
    catch(err){
      return err as any
    }
  }
}

export default InfoSalesVerify