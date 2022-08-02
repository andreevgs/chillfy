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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const typeorm_2 = require("typeorm");
const jwt = require("jsonwebtoken");
const bcrypt_1 = require("bcrypt");
const uuid_1 = require("uuid");
const refresh_token_entity_1 = require("./entities/refresh-token.entity");
let AuthService = class AuthService {
    constructor(dataSource, userRepository, refreshTokenRepository) {
        this.dataSource = dataSource;
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
    }
    async login(loginUserDto) {
        const user = await this.checkUserCredentials(loginUserDto);
        this.checkUserEmailConfirmation(user);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const refreshToken = await this.generateRefreshTokenQueryRunner(user, queryRunner);
            await queryRunner.commitTransaction();
            return {
                accessToken: this.generateAccessToken(user),
                refreshToken,
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error('Error during login. ' + error);
        }
        finally {
            await queryRunner.release();
        }
    }
    async createConfirmationCode(loginUserDto, code) {
        const user = await this.checkUserCredentials(loginUserDto);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        let responseMessage = '';
        try {
            await queryRunner.manager.update(user_entity_1.UserEntity, { id: user.id }, { confirmationCode: code });
            await queryRunner.commitTransaction();
            responseMessage = 'confirmation code was sent';
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            responseMessage = 'error creating confirmation code';
        }
        finally {
            await queryRunner.release();
        }
        return { message: responseMessage };
    }
    async confirmationCode(confirmEmailDto) {
        const user = await this.checkUserCredentials(confirmEmailDto);
        if (user.confirmationCode !== confirmEmailDto.code) {
            throw new common_1.HttpException('wrong code', common_1.HttpStatus.FORBIDDEN);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        let responseMessage = '';
        try {
            await queryRunner.manager.update(user_entity_1.UserEntity, { id: user.id }, { isConfirmed: true });
            await queryRunner.commitTransaction();
            responseMessage = 'email was confirmed successfully';
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            responseMessage = 'error during confirmation';
        }
        finally {
            await queryRunner.release();
        }
        return { message: responseMessage };
    }
    async getNewTokensPair(req) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const refreshToken = await this.generateRefreshTokenQueryRunner(req.user, queryRunner);
            await queryRunner.commitTransaction();
            return {
                accessToken: this.generateAccessToken(req.user),
                refreshToken,
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error('Error getting new tokens pair. ' + error);
        }
        finally {
            await queryRunner.release();
        }
    }
    async logOut(req) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        let responseMessage = '';
        try {
            await queryRunner.manager.update(refresh_token_entity_1.RefreshTokenEntity, { user: req.user }, { token: null, expirationDate: null });
            await queryRunner.commitTransaction();
            responseMessage = 'ok';
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            responseMessage = 'error during logout';
        }
        finally {
            await queryRunner.release();
        }
        return { message: responseMessage };
    }
    async checkUserCredentials(loginUserDto) {
        const user = await this.userRepository.findOne({
            where: {
                email: loginUserDto.email
            }
        });
        const isPasswordCorrect = await (0, bcrypt_1.compare)(loginUserDto.password, user.password);
        if (!isPasswordCorrect) {
            throw new common_1.HttpException('wrong email or password', common_1.HttpStatus.FORBIDDEN);
        }
        return user;
    }
    checkUserEmailConfirmation(user) {
        if (!user.isConfirmed) {
            throw new common_1.HttpException({ isConfirmed: user.isConfirmed }, common_1.HttpStatus.FORBIDDEN);
        }
    }
    async verifyRefreshTokenAndGetUser(refreshToken) {
        const storedRefreshToken = await this.refreshTokenRepository.findOne({
            where: { token: refreshToken },
            relations: ['user'],
        });
        if (!storedRefreshToken)
            throw new Error();
        if (storedRefreshToken.expirationDate.getTime() < new Date().getTime())
            throw new Error();
        return storedRefreshToken.user;
    }
    generateAccessToken(userEntity) {
        return jwt.sign({
            id: userEntity['id'],
            email: userEntity.email,
        }, process.env.JWT_AT_SECRET, {
            expiresIn: '7d',
        });
    }
    async generateRefreshTokenQueryRunner(userEntity, queryRunner) {
        let expiredAt = new Date(Date.now() + parseInt(process.env.JWT_RT_EXPIRATION_MIN) * 60000);
        let token = (0, uuid_1.v4)();
        await queryRunner.manager.update(refresh_token_entity_1.RefreshTokenEntity, { user: userEntity }, { token: token, expirationDate: expiredAt });
        return token;
    }
};
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "getNewTokensPair", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "logOut", null);
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshTokenEntity)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map