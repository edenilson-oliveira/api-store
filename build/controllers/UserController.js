"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserController {
    getUsers(req, res) {
        res.json({
            message: 'Hello World'
        });
    }
}
const userController = new UserController();
exports.default = userController;
