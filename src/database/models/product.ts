import { Model } from 'sequelize';
import sequelize from 'sequelize';
import db from '.';

class Product extends Model{
  declare id: number
  declare sellerId: number
  declare name: string
  declare price: number
  declare quantity: number
  declare discount: number
  declare description: string

  declare createdAt: Date
  declare updatedAt: Date
}

Product.init({
  id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  sellerId: {
    type: sequelize.INTEGER,
    allowNull: false,
  },
  name: {
    type: sequelize.STRING,
    allowNull: false
  },
  price: {
    type: sequelize.FLOAT,
    allowNull: false
  },
  quantity: {
    type: sequelize.INTEGER,
    allowNull: false
  },
  discount: {
    type: sequelize.FLOAT
  },
  description: {
    type: sequelize.STRING,
    allowNull: false
  },
  category: {
    type: sequelize.STRING,
    allowNull: false
  },
  salesQuantity: {
    type: sequelize.INTEGER,
    defaultValue: 0,
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
  tableName: 'products',
  timestamps: true,
})

export default Product