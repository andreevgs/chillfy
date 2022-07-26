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
exports.UserSeed = void 0;
const nestjs_command_1 = require("nestjs-command");
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../enums/role.enum");
const user_entity_1 = require("../entities/user.entity");
const typeorm_1 = require("typeorm");
const role_entity_1 = require("../entities/role.entity");
const refresh_token_entity_1 = require("../../auth/entities/refresh-token.entity");
let UserSeed = class UserSeed {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async create() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const adminRole = await queryRunner.manager.findOne(role_entity_1.RoleEntity, { where: { nameEn: role_enum_1.default.Admin } });
            const moderatorRole = await queryRunner.manager.findOne(role_entity_1.RoleEntity, { where: { nameEn: role_enum_1.default.Moderator } });
            const userRole = await queryRunner.manager.findOne(role_entity_1.RoleEntity, { where: { nameEn: role_enum_1.default.User } });
            const newAdmin = new user_entity_1.UserEntity();
            const newModerator = new user_entity_1.UserEntity();
            const newUser = new user_entity_1.UserEntity();
            Object.assign(newAdmin, {
                username: 'admin',
                firstName: 'Admin',
                lastName: 'Admin',
                phoneNumber: '+375777777777',
                email: 'unicode256@yandex.by',
                password: '12345678',
                role: adminRole
            });
            Object.assign(newModerator, {
                username: 'moderator',
                firstName: 'Moderator',
                lastName: 'Moderator',
                phoneNumber: '+375777777778',
                email: 'unicode257@yandex.by',
                password: '12345678',
                role: moderatorRole
            });
            Object.assign(newUser, {
                username: 'user',
                firstName: 'User',
                lastName: 'User',
                phoneNumber: '+375777777779',
                email: 'unicode258@yandex.by',
                password: '12345678',
                role: userRole
            });
            const createdAdmin = await queryRunner.manager.save(newAdmin);
            const createdModerator = await queryRunner.manager.save(newModerator);
            const createdUser = await queryRunner.manager.save(newUser);
            const adminRefreshToken = new refresh_token_entity_1.RefreshTokenEntity();
            const moderatorRefreshToken = new refresh_token_entity_1.RefreshTokenEntity();
            const userRefreshToken = new refresh_token_entity_1.RefreshTokenEntity();
            Object.assign(adminRefreshToken, {
                token: null,
                expirationDate: null,
                user: createdAdmin
            });
            Object.assign(moderatorRefreshToken, {
                token: null,
                expirationDate: null,
                user: createdModerator
            });
            Object.assign(userRefreshToken, {
                token: null,
                expirationDate: null,
                user: createdUser
            });
            await queryRunner.manager.save(adminRefreshToken);
            await queryRunner.manager.save(moderatorRefreshToken);
            await queryRunner.manager.save(userRefreshToken);
            await queryRunner.commitTransaction();
            console.log('created users: ', newAdmin, newModerator, newUser);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error('Error seeding data: ' + error);
        }
        finally {
            await queryRunner.release();
        }
    }
};
__decorate([
    (0, nestjs_command_1.Command)({ command: 'create:users', describe: 'create users' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserSeed.prototype, "create", null);
UserSeed = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], UserSeed);
exports.UserSeed = UserSeed;
//# sourceMappingURL=user.seed.js.map