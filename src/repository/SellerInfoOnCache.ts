import client from '../redisConfig';

export default interface UserSellerInfo{
  id: number;
  email: string;
  phone: string;
}

export default class SellerInfoOnCache{
  
  public async add(info: any) {
    const sellerInfo = await this.getInfo()
      
    sellerInfo.push(info)
  
    await client.set('user-seller-info',  JSON.stringify(sellerInfo))
  }
  
  public async edit(info: any) {
    const sellerInfo = await this.getInfo()
    
    const newData = {
      id: info.id,
      email: info.email,
      phone: info.phone
    }
    
    sellerInfo.map((value: UserSellerInfo,index) => {
      if(info.id === value.id){
        
        if(!info.email){
          newData.email = value.email
        }
        if(!info.phone){
          newData.phone = value.phone
        }
        
        sellerInfo.splice(index,1)
      }
    })
      
    sellerInfo.push(newData as UserSellerInfo)
  
    await client.set('user-seller-info',  JSON.stringify(sellerInfo))
  }
  
  public async getInfo(): Promise<UserSellerInfo[]> {
    const sellerInfo = await client.get('user-seller-info') || ''
    
    return sellerInfo ? JSON.parse(sellerInfo) : []
  }
  
}