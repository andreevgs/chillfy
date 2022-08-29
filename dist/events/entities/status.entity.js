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
exports.StatusEntity = void 0;
const typeorm_1 = require("typeorm");
const invitation_entity_1 = require("./invitation.entity");
let StatusEntity = class StatusEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StatusEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StatusEntity.prototype, "nameRu", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StatusEntity.prototype, "nameEn", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => invitation_entity_1.InvitationEntity, invitation => invitation.status),
    __metadata("design:type", Array)
], StatusEntity.prototype, "invitations", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    }),
    __metadata("design:type", Date)
], StatusEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    }),
    __metadata("design:type", Date)
], StatusEntity.prototype, "updatedAt", void 0);
StatusEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'statuses' })
], StatusEntity);
exports.StatusEntity = StatusEntity;
//# sourceMappingURL=status.entity.js.map