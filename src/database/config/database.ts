import { Options } from 'sequelize';

const dotenv = require('dotenv')
const path = require('path')

dotenv.config({path: path.resolve(__dirname, '../../../.env')})

const { DB_NAME,DB_USER,DB_PWD,DB_HOST,DB_DIALECT} = process.env;

const config: Options = {
  username: DB_USER,
  password: DB_PWD,
  database: DB_NAME,
  host: DB_HOST,
  dialect: 'mysql',
};


export = config