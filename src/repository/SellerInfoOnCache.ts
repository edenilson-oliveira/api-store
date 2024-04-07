import client from '../redisConfig';

export default interface UserSellerInfo{
  id: number;
  email: string;
  phone: string;
}

export default class SellerInfoOnCache{
  
  public async add(info: any) {
    const sellerInfo = await this.getInfo()
      
    const data = sellerInfo.push(info)
  
    await client.set('user-seller-info',  JSON.stringify(sellerInfo))
  }
  
  public async getInfo(): Promise<UserSellerInfo[]> {
    const sellerInfo = await client.get('user-seller-info') || ''
    
    return sellerInfo ? JSON.parse(sellerInfo) : []
  }
  
}