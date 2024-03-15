import nodemailer,{ Transporter } from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.resolve(__dirname, '../../.env')})

class SendMail{
  private to: string;
  private subject: string;
  private html: string;
  
  constructor(to: string,subject: string,html: string){
    this.to = to
    this.subject = subject
    this.html = html
  }
  
  public execute(){
    
    const { MAIL_HOST,MAIL_PORT,MAIL_USER,MAIL_PASSWORD } = process.env
    const transporter: Transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: false,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD
      }
    } as nodemailer.TransportOptions)
    
    
    const options = {
      from: 'api.store@example.com',
      to: this.to,
      subject: this.subject,
      html: this.html
    }
    
    transporter.sendMail(options,(err,data) => {
      if(err){
        return `Error to send email`
      }
      else{
        return 'Email sent successfully'
      }
    })
  }
}

export default SendMail