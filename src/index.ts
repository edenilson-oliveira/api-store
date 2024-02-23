import 'dotenv/config';

import { App } from './app';
import connect from './database/models/index';

const app = new App()

app.server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})



 
