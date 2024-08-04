import { Model } from 'sequelize';
import sequelize from 'sequelize';
import db from '.';

class Payment extends Model{
  declare id: number
  declare purchaseId: number
  declare paymentMethod: string
  declare value: number

  declare createdAt: Date
  declare updatedAt: Date
}

Payment.init({
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    purchaseId: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    paymentMethod: {
        type: sequelize.STRING,
        allowNull: false
    },
    value: {
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
    tableName: 'payment',
    timestamps: true,
});

export default Payment