import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import 'dotenv/config';
import RefreshToken from '../database/models/refreshToken';


class GenerateRefreshToken{
  public execute(id: number){
    
    const { JWT_REFRESH_TOKEN_KEY,REFRESH_TOKEN_EXPIRES_IN } = process.env
    
    const refreshToken = jwt.sign({id},process.env.JWT_REFRESH_TOKEN_KEY as string, { expiresIn: REFRESH_TOKEN_EXPIRES_IN+'d' })
    
    const expiresIn = dayjs().add(Number(REFRESH_TOKEN_EXPIRES_IN), 'days').toDate()
    
    RefreshToken.create({
      refreshToken,
      userId: id,
      expiresIn,
    })
    
    return refreshToken
  }
}

export default new GenerateRefreshToken