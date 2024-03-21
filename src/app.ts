import express from 'express';
import cookieParser from 'cookie-parser';
import router from './routes/';
import helmet from 'helmet';
import rateLimit from './middleware/rateLimit';
import toobusy from './middleware/toobusy'
import bodyParser from "body-parser";

export class App{
  public server: express.Application;
  
  constructor(){
    this.server = express();
    this.middleware();
    this.routes()
  }
  
  private middleware(){
    this.server.use(bodyParser.json({ limit: "5kb" }));
    this.server.use(bodyParser.urlencoded({ extended: true }));
    this.server.use(cookieParser())
    this.server.use(helmet())
    this.server.use(rateLimit('all',100,60*50))
    this.server.use(toobusy)
    
  }
  
  private routes(){
    this.server.use(router)
  }
}

export default App