"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("sequelize"));
const _1 = __importDefault(require("."));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_2.default.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    firstName: {
        type: sequelize_2.default.STRING,
        allowNull: false,
    },
    lastName: {
        type: sequelize_2.default.STRING,
    },
    email: {
        type: sequelize_2.default.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_2.default.STRING,
        allowNull: false
    },
    createdAt: {
        allowNull: false,
        type: sequelize_2.default.DATE,
        defaultValue: new Date(),
    },
    updatedAt: {
        allowNull: false,
        type: sequelize_2.default.DATE,
        defaultValue: new Date(),
    }
}, {
    sequelize: _1.default,
    tableName: 'users',
    timestamps: true,
});
exports.default = User;
