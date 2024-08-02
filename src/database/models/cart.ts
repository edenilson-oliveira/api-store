import { Model } from 'sequelize';
import sequelize from 'sequelize';
import db from '.';

class Cart extends Model{
  declare id: number
  declare userId: number
  declare productId: number
  declare quantity: number

  declare createdAt: Date
  declare updatedAt: Date
}

Cart.init({
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    userId: {
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
    tableName: 'cart',
    timestamps: true,
});

export default Cart