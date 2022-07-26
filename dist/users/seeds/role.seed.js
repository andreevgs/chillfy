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
exports.RoleSeed = void 0;
const nestjs_command_1 = require("nestjs-command");
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../enums/role.enum");
const typeorm_1 = require("typeorm");
const role_entity_1 = require("../entities/role.entity");
let RoleSeed = class RoleSeed {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async create() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const createdAdminRole = new role_entity_1.RoleEntity();
            const createdModeratorRole = new role_entity_1.RoleEntity();
            const createdUserRole = new role_entity_1.RoleEntity();
            Object.assign(createdAdminRole, {
                nameEn: role_enum_1.default.Admin,
                nameRu: null,
            });
            Object.assign(createdModeratorRole, {
                nameEn: role_enum_1.default.Moderator,
                nameRu: null,
            });
            Object.assign(createdUserRole, {
                nameEn: role_enum_1.default.User,
                nameRu: null,
            });
            await queryRunner.manager.save(createdAdminRole);
            await queryRunner.manager.save(createdModeratorRole);
            await queryRunner.manager.save(createdUserRole);
            await queryRunner.commitTransaction();
            console.log('created roles: ', createdAdminRole, createdModeratorRole, createdUserRole);
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
    (0, nestjs_command_1.Command)({ command: 'create:roles', describe: 'create roles' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoleSeed.prototype, "create", null);
RoleSeed = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], RoleSeed);
exports.RoleSeed = RoleSeed;
//# sourceMappingURL=role.seed.js.map