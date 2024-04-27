import { p } from 'sequelize';
import sequelize from 'sequelize';
import db from '.';

class Product extends Model{
  declare id: number
  declare sellerId: number
  declare price: number
  declare quantity: number
  declare discount: number
  declare description: string
  declare img: string
  
  declare createdAt: Date
  declare updatedAt: Date
}

Seller.init({
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
    sellerId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  discount: {
    type: Sequelize.FLOAT
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  img: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: new Date(),
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: new Date(),
  }
      
},{
  sequelize: db,
  tableName: 'products',
  timestamps: true,
})

export default Product