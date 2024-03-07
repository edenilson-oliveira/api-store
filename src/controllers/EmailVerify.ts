import User from '../database/models/user';

interface EmailVerifyInfo{
  emailExists: boolean;
  user: User["dataValues"]|undefined;
}

class EmailVerify{
  private email: string;
  
  constructor(email: string){
    this.email = email
  }
  
  public async execute(): Promise<EmailVerifyInfo> {
    const userDb = await User.findAll({
      where: {
        email: this.email
      }
    })
    
    return { 
      emailExists: userDb.length > 0 ? true : false,
      user: userDb.length ? userDb[0].dataValues: undefined
      }
  }
}

export default EmailVerify