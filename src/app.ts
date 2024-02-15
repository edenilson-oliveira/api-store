import express from 'express';
import router from './routes/login.ts'

export class App{
  public server: express.Application;
  
  constructor(){
    this.server = express();
    this.middleware();
    this.routes()
  }
  
  private middleware(){
    this.server.use(express.json())
  }
  
  private routes(){
    this.server.use(router)
  }
}

export default App