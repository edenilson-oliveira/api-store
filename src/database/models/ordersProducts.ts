import { Model } from 'sequelize';
import sequelize from 'sequelize';
import db from '.';

class OrdersProducts extends Model{
  declare id: number
  declare orderID: number
  declare productId: number
  declare quantity: number
  declare price: number

  declare createdAt: Date
  declare updatedAt: Date
}

OrdersProducts.init({
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    orderId: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    productId: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    quantity: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    price: {
        type: sequelize.FLOAT,
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
    tableName: 'orders-products',
    timestamps: true,
});

export default OrdersProducts