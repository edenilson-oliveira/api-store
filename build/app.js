"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/"));
class App {
    server;
    constructor() {
        this.server = (0, express_1.default)();
        this.middleware();
        this.routes();
    }
    middleware() {
        this.server.use(express_1.default.json());
    }
    routes() {
        this.server.use(routes_1.default);
    }
}
exports.App = App;
exports.default = App;
