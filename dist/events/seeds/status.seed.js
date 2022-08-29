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
exports.StatusSeed = void 0;
const nestjs_command_1 = require("nestjs-command");
const common_1 = require("@nestjs/common");
const status_enum_1 = require("../enums/status.enum");
const typeorm_1 = require("typeorm");
const status_entity_1 = require("../entities/status.entity");
let StatusSeed = class StatusSeed {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async create() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const createdNoAnswerStatus = new status_entity_1.StatusEntity();
            const createdCanNotStatus = new status_entity_1.StatusEntity();
            const createdMostLikelyStatus = new status_entity_1.StatusEntity();
            const createdDefinitelyAttendStatus = new status_entity_1.StatusEntity();
            Object.assign(createdNoAnswerStatus, {
                nameEn: status_enum_1.default.NoAnswer,
                nameRu: null,
            });
            Object.assign(createdCanNotStatus, {
                nameEn: status_enum_1.default.CanNot,
                nameRu: null,
            });
            Object.assign(createdMostLikelyStatus, {
                nameEn: status_enum_1.default.MostLikely,
                nameRu: null,
            });
            Object.assign(createdDefinitelyAttendStatus, {
                nameEn: status_enum_1.default.DefinitelyAttend,
                nameRu: null,
            });
            await queryRunner.manager.save(createdNoAnswerStatus);
            await queryRunner.manager.save(createdCanNotStatus);
            await queryRunner.manager.save(createdMostLikelyStatus);
            await queryRunner.manager.save(createdDefinitelyAttendStatus);
            await queryRunner.commitTransaction();
            console.log('created roles: ', createdNoAnswerStatus, createdCanNotStatus, createdMostLikelyStatus, createdDefinitelyAttendStatus);
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
    (0, nestjs_command_1.Command)({ command: 'create:statuses', describe: 'create statuses' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatusSeed.prototype, "create", null);
StatusSeed = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], StatusSeed);
exports.StatusSeed = StatusSeed;
//# sourceMappingURL=status.seed.js.map