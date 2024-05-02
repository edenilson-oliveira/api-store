import { Model } from 'sequelize';
import sequelize from 'sequelize';
import db from '.';

class Seller extends Model{
  declare id: number
  declare userId: number
  declare storeName: string
  declare description: string
  declare emailStore: string
  declare category: string
  declare status: boolean 
  declare phone: string
  
  declare createdAt: Date
  declare updatedAt: Date
}

Seller.init({
  id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: sequelize.INTEGER,
    allowNull: false,
  },
  storeName: {
    type: sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: sequelize.STRING,
  },
  emailStore: {
    type: sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  category: {
    type: sequelize.STRING,
  },
  status: {
    type: sequelize.BOOLEAN,
    allowNull: false
  },
  phone: {
    type: sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    allowNull: false,
    type: sequelize.DATE,
    defaultValue: new Date(),
  },
  updatedAt: {
    allowNull: false,
    type: sequelize.DATE,
    defaultValue: new Date(),
  }
},{
  sequelize: db,
  tableName: 'seller',
  timestamps: true,
})

export default Seller