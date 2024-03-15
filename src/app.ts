import express from 'express';
import cookieParser from 'cookie-parser'
import router from './routes/'
import helmet from 'helmet'

export class App{
  public server: express.Application;
  
  constructor(){
    this.server = express();
    this.middleware();
    this.routes()
  }
  
  private middleware(){
    this.server.use(express.json())
    this.server.use(cookieParser())
    this.server.use(helmet())
  }
  
  private routes(){
    this.server.use(router)
  }
}

export default App