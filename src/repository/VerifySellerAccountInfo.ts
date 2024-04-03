import client from '../redisConfig';

type UserSellerInfo = {
  id: number;
  email: string;
  phone: string;
}

class VerifySellerAccount{
  private readonly id: number
  private readonly  email: string
  private readonly phone: string
  
  constructor(id: number, email: string,phone: string){
    this.id = id,
    this.email = email,
    this.phone = phone
  }
  
  public async getInfoOnCache(){
    
    const userSellerInfo = await client.get('user-seller-info') || ''
    
    return userSellerInfo ? JSON.parse(userSellerInfo) : false
  }
  
  public async verifyInfoSeller(){
    const userInfo = await this.getInfoOnCache()
    try{
      if(userInfo){
        userInfo.map((value: UserSellerInfo) => {
          
          if(this.id === value.id){
            throw new Error('Your account seller already exist')
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

export default VerifySellerAccount