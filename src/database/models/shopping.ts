import { Model } from 'sequelize';
import sequelize from 'sequelize';
import db from '.';

class Shopping extends Model{
  declare id: number
  declare userId: number
  declare price: number
  declare staus: string

  declare createdAt: Date
  declare updatedAt: Date
}

Shopping.init({
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
    tableName: 'shopping',
    timestamps: true,
});

export default Shopping