"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
const users_service_1 = require("../../users/users.service");
const auth_service_1 = require("../auth.service");
let AuthMiddleware = class AuthMiddleware {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async use(req, _, next) {
        if (!req.headers.authorization) {
            req.user = null;
            next();
            return;
        }
        const token = req.headers.authorization.split(' ');
        const tokenType = token[0];
        let tokenValue = tokenType === 'Bearer' ? token[1] : null;
        try {
            const decode = jwt.verify(tokenValue, 'at_secret');
            req.user = await this.userService.findOne(decode['id']);
            next();
            return;
        }
        catch (err) {
            req.user = null;
        }
        try {
            const currentUser = await this.authService.verifyRefreshTokenAndGetUser(tokenValue);
            req.refreshToken = true;
            req.user = currentUser;
        }
        catch (err) {
            req.refreshToken = false;
        }
        next();
    }
};
AuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        auth_service_1.AuthService])
], AuthMiddleware);
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.middelware.js.map