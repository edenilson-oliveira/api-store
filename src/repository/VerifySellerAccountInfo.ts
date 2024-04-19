import client from '../redisConfig';
import UserSellerInfo from './SellerInfoOnCache';
import SellerInfoOnCache from './SellerInfoOnCache';

class VerifySellerAccount{
  
  private sellerInfo: SellerInfoOnCache
  private userInfo: UserSellerInfo[]
  
  constructor(){
    this.sellerInfo = new SellerInfoOnCache()
    this.userInfo = [{id: -1,email: '',phone: ''}] as UserSellerInfo[]
    
    this.start()
  }
  
  private async start(){
    this.userInfo = await this.sellerInfo.getInfo()
  }
  
  public async verifyIdSeler(id: number): Promise<string | void>{
  
    console.log(this.userInfo)
    
    if(this.userInfo.length > 0){
      this.userInfo.map((value: UserSellerInfo) => {
        if(id === value.id){
          return 'Your account seller already exist'
        }
      })
    }
  }
  
  public async verifyEmailSeler(email: string): Promise<string | void>{
    
    if(this.userInfo.length > 0){
      this.userInfo.map((value: UserSellerInfo) => {
        if(email === value.email){
          return 'Email seller already exist'
        }
      })
    }
  }
  
  public async verifyPhoneSeler(phone: string): Promise<string | void>{
    
    if(this.userInfo.length > 0){
      this.userInfo.map((value: UserSellerInfo) => {
        if(phone === value.phone){
          return 'Phone number sales already exist'
        }
      })
    }
  }
}

export default VerifySellerAccount 