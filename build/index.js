"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const index_1 = __importDefault(require("./database/models/index"));
console.log(index_1.default);
//import connection from './connect';
const app = new app_1.App();
app.server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
