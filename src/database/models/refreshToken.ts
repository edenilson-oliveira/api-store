import { Model } from 'sequelize';
import sequelize from 'sequelize';
import db from '.';

class RefreshToken extends Model{
  declare id: number
  declare refreshToken: string
  declare userId: number
  
  declare createdAt: Date
  declare updatedAt: Date
  declare expiresIn: Date
}

RefreshToken.init({
  id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  refreshToken: {
    type: sequelize.STRING,
    allowNull: false,
  },
  userId: {
    type: sequelize.INTEGER,
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
  },
  expiresIn: {
    allowNull: false,
    type: sequelize.DATE,
    defaultValue: new Date(),
  }
},{
  sequelize: db,
  tableName: 'refresh_token',
  timestamps: true,
})

export default RefreshToken