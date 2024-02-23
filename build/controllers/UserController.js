"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../database/models/user"));
class UserController {
    async getUsers(req, res) {
        try {
            const user = await user_1.default.findAll({});
            console.log(user);
            res.json(user);
            res.status(200);
        }
        catch (err) {
            console.log(err);
            res.status(501);
        }
    }
    async createUser(req, res) {
        try {
            const user = await user_1.default.create(req.body);
            res.json(user).status(200);
        }
        catch (err) {
            console.log(err);
            res.json({ message: 'Internal server error' }).status(501);
        }
    }
}
const userController = new UserController();
exports.default = userController;
