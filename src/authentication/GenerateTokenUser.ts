import jwt from 'jsonwebtoken';
import 'dotenv/config';

class GenerateTokenUser{
  public execute(id: number): string{
    const token = jwt.sign({id},process.env.SECRET_KEY as string, {expiresIn: process.env.EXPIRES_IN})
    
    return token
  }
}

const generateTokenUser = new GenerateTokenUser()

export default generateTokenUser