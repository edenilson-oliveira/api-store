import client from '../redisConfig';
import UserSellerInfo from './SellerInfoOnCache';
import SellerInfoOnCache from './SellerInfoOnCache';

class VerifySellerAccount{
  private readonly id: number
  private readonly  email: string
  private readonly phone: string
  
  constructor(id: number, email: string,phone: string){
    this.id = id,
    this.email = email,
    this.phone = phone
  }
  
  public async verifyInfoSeller(){
    const sellerInfo = new SellerInfoOnCache()
    const userInfo = await sellerInfo.getInfo()
    
    try{
      if(userInfo.length > 0){
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