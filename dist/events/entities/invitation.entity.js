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
exports.InvitationEntity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const event_entity_1 = require("./event.entity");
const status_entity_1 = require("./status.entity");
let InvitationEntity = class InvitationEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InvitationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => status_entity_1.StatusEntity, status => status.invitations),
    __metadata("design:type", status_entity_1.StatusEntity)
], InvitationEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, user => user.invitations),
    __metadata("design:type", user_entity_1.UserEntity)
], InvitationEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_entity_1.EventEntity, event => event.invitations),
    __metadata("design:type", event_entity_1.EventEntity)
], InvitationEntity.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    }),
    __metadata("design:type", Date)
], InvitationEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    }),
    __metadata("design:type", Date)
], InvitationEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], InvitationEntity.prototype, "deletedAt", void 0);
InvitationEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'invitations' })
], InvitationEntity);
exports.InvitationEntity = InvitationEntity;
//# sourceMappingURL=invitation.entity.js.map