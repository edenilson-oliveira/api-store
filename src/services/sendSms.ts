import { Twilio } from 'twilio';
import 'dotenv/config';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.PHONE_NUMBER

const client = new Twilio(accountSid, authToken)

class SendSms{
  body: string
  to: string
  
  constructor(body: string,to: string){
    this.body = body,
    this.to = to
  }
  
  public async execute(){
    const response = await client.messages.create({
       body: this.body,
       from: phoneNumber,
       to: this.to
     }).then(message => message)
      .catch(err => err.message);
     
     return response
  }
}

export default SendSms
