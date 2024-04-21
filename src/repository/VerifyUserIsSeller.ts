import UserSellerInfo from './SellerInfoOnCache'
import SellerInfoOnCache from './SellerInfoOnCache'

class VerifyUserIsSeller{
  private readonly id: number
  
  constructor(id: number){
    this.id = id
  }
  
  public async execute(): Promise<string | undefined> {
    const sellerInfo = await (new SellerInfoOnCache()).getInfo()
    
    const verify = sellerInfo.length > 0 ? sellerInfo.some((value 
    : UserSellerInfo) => this.id === value.id) : false
    
    if(verify){
      return
    }
      
    return 'This account is not seller account'
  }
}

export default VerifyUserIsSeller