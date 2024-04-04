import client from '../redisConfig';

interface UserSellerInfo{
  id: number;
  email: string;
  phone: string;
}

class VerifyUserIsSeller{
  private readonly id: number
  
  constructor(id: number){
    this.id = id
  }
  
  public async execute(){
    const userSellerInfo = await client.get('user-seller-info') || ''
    
    const sellerInfo = JSON.parse(userSellerInfo)
    
    const verify = sellerInfo.some((value 
    :UserSellerInfo) => this.id === value.id)
    
    if(verify){
      return true
    }
      
    return 'This account is not seller'
  }
}

export default VerifyUserIsSeller