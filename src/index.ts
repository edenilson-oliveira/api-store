import dotenv from 'dotenv';
dotenv.config()

import { App } from './app.ts';
import connection from './database.ts'

const app = new App()

app.server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})