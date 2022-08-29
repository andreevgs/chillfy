"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedsModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_command_1 = require("nestjs-command");
const role_seed_1 = require("../../users/seeds/role.seed");
const user_seed_1 = require("../../users/seeds/user.seed");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const role_entity_1 = require("../../users/entities/role.entity");
const refresh_token_entity_1 = require("../../auth/entities/refresh-token.entity");
const status_seed_1 = require("../../events/seeds/status.seed");
let SeedsModule = class SeedsModule {
};
SeedsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_command_1.CommandModule,
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, role_entity_1.RoleEntity, refresh_token_entity_1.RefreshTokenEntity]),
        ],
        providers: [role_seed_1.RoleSeed, user_seed_1.UserSeed, status_seed_1.StatusSeed],
        exports: [role_seed_1.RoleSeed, user_seed_1.UserSeed, status_seed_1.StatusSeed],
    })
], SeedsModule);
exports.SeedsModule = SeedsModule;
//# sourceMappingURL=seeds.module.js.map