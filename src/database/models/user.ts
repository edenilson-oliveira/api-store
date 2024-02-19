import { Model } from 'sequelize';
import sequelize from 'sequelize';
import db from '.';

class User extends Model{
  declare id: number
  declare firstName: string
  declare lastName: string
  declare email: string
  declare password: string
  
  declare createdAt: Date
  declare updatedAt: Date
}

User.init({
  id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  firstName: {
    type: sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: sequelize.STRING,
  },
  email: {
    type: sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
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
  tableName: 'users',
  underscored: true,
  timestamps: true,
})

export default User