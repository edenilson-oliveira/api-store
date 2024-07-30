import { Model } from 'sequelize';
import sequelize from 'sequelize';
import db from '.';

class ImageProducts extends Model{
  declare id: number
  declare productId: number
  declare filename: string
  declare url: string

  declare createdAt: Date
  declare updatedAt: Date
}

ImageProducts.init({
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    productId: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    filename: {
        type: sequelize.STRING,
        allowNull: false
    },
    url: {
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
    tableName: 'image-products',
    timestamps: true,
})

export default ImageProducts

