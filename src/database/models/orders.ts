import { Model } from 'sequelize';
import sequelize from 'sequelize';
import db from '.';

class Orders extends Model{
  declare id: number
  declare userId: number
  declare price: number
  declare status: string

  declare createdAt: Date
  declare updatedAt: Date
}

Orders.init({
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
    price: {
        type: sequelize.FLOAT,
        allowNull: false
    },
    status: {
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
    tableName: 'orders',
    timestamps: true,
});

export default Orders