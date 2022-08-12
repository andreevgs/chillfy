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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const login_user_dto_1 = require("../users/dto/login-user.dto");
const users_service_1 = require("../users/users.service");
const refresh_token_guard_1 = require("./guards/refresh-token.guard");
const confirm_email_dto_1 = require("./dto/confirm-email.dto");
const emailing_service_1 = require("../emailing/emailing.service");
const confirm_email_for_restoring_dto_1 = require("./dto/confirm-email-for-restoring.dto");
const restore_dto_1 = require("./dto/restore.dto");
let AuthController = class AuthController {
    constructor(authService, usersService, emailingService) {
        this.authService = authService;
        this.usersService = usersService;
        this.emailingService = emailingService;
    }
    async createUser(createAuthDto) {
        const code = this.usersService.generateConfirmationCode();
        const user = await this.usersService.createUser(createAuthDto, code);
        try {
            await this.emailingService.sendMail({
                to: createAuthDto.email,
                subject: 'Confirmation code',
                text: code.toString()
            });
        }
        catch (_a) {
            throw new common_1.HttpException('could not send email', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return { user };
    }
    async login(loginUserDto) {
        return await this.authService.login(loginUserDto);
    }
    async sendConfirmationCode(loginUserDto) {
        const code = this.usersService.generateConfirmationCode();
        const createdConfirmationCodeResponse = await this.authService.createConfirmationCode(loginUserDto, code);
        try {
            await this.emailingService.sendMail({
                to: loginUserDto.email,
                subject: 'Confirmation code',
                text: code.toString()
            });
            return createdConfirmationCodeResponse;
        }
        catch (_a) {
            return { message: 'could not send email' };
        }
    }
    async confirmCode(confirmEmailDto) {
        return await this.authService.confirmationCode(confirmEmailDto);
    }
    async sendConfirmationCodeForRestoring(confirmEmailForRestoringDto) {
        const code = this.usersService.generateConfirmationCode();
        const createdConfirmationCodeResponse = await this.authService.createConfirmationCodeForRestoring(confirmEmailForRestoringDto, code);
        try {
            await this.emailingService.sendMail({
                to: confirmEmailForRestoringDto.email,
                subject: 'Confirmation code for password restoring',
                text: code.toString()
            });
            return createdConfirmationCodeResponse;
        }
        catch (_a) {
            return { message: 'could not send email' };
        }
    }
    async restore(restoreDto) {
        const restoredResponse = await this.authService.restore(restoreDto);
        this.emailingService.sendMail({
            to: restoreDto.email,
            subject: 'Password was restored',
            text: 'Your password was successfully changed'
        });
        return restoredResponse;
    }
    async getNewTokensPair(req) {
        return await this.authService.getNewTokensPair(req);
    }
    async logOut(req) {
        return await this.authService.logOut(req);
    }
};
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('signin'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('code'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendConfirmationCode", null);
__decorate([
    (0, common_1.Post)('confirmation'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)('confirmation')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirm_email_dto_1.ConfirmEmailDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmCode", null);
__decorate([
    (0, common_1.Post)('restore/code'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirm_email_for_restoring_dto_1.ConfirmEmailForRestoringDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendConfirmationCodeForRestoring", null);
__decorate([
    (0, common_1.Post)('restore'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [restore_dto_1.RestoreDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "restore", null);
__decorate([
    (0, common_1.UseGuards)(refresh_token_guard_1.RefreshTokenGuard),
    (0, common_1.Get)('tokens'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getNewTokensPair", null);
__decorate([
    (0, common_1.UseGuards)(refresh_token_guard_1.RefreshTokenGuard),
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logOut", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService,
        emailing_service_1.EmailingService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map