import client from '../redisConfig';
import UserSellerInfo from './SellerInfoOnCache';
import SellerInfoOnCache from './SellerInfoOnCache';

class VerifySellerAccount{
  
  private sellerInfo: SellerInfoOnCache
  
  constructor(){
    this.sellerInfo = new SellerInfoOnCache()
  }
  
  public async verifyIdSeler(id: number): Promise<string | undefined>{
    
    const userInfo = await this.sellerInfo.getInfo()
    
    let verify: string | undefined;
    
    if(userInfo.length > 0){
      userInfo.map((value: UserSellerInfo) => {
        if(id === value.id){
          verify = 'Your account seller already exist'
        }
      })
    }
    
    return verify
  }
  
  public async verifyEmailSeler(email: string): Promise<string | undefined>{
    
    const userInfo = await this.sellerInfo.getInfo()
    
    let verify: string | undefined;
    
    if(userInfo.length > 0){
      userInfo.map((value: UserSellerInfo) => {
        if(email === value.email){
          verify = 'Email seller already exist'
        }
      })
    }
    
    return verify
  }
  
  public async verifyPhoneSeler(phone: string): Promise<string | undefined>{
    
    const userInfo = await this.sellerInfo.getInfo()
    
    let verify: string | undefined;
    
    if(userInfo.length > 0){
      userInfo.map((value: UserSellerInfo) => {
        if(phone === value.phone){
          verify = 'Phone number sales already exist'
        }
      })
    }
    return verify
  }
}

export default VerifySellerAccount 