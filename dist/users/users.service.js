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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_enum_1 = require("./enums/role.enum");
const role_entity_1 = require("./entities/role.entity");
const contact_request_entity_1 = require("../account/entities/contact-request.entity");
const users_query_dto_1 = require("./dto/users-query.dto");
let UsersService = class UsersService {
    constructor(dataSource, userRepository, contactRequestRepository, roleRepository) {
        this.dataSource = dataSource;
        this.userRepository = userRepository;
        this.contactRequestRepository = contactRequestRepository;
        this.roleRepository = roleRepository;
    }
    findCurrent(req) {
        return req.user;
    }
    async createUser(createUserDto, code) {
        const userRole = await this.roleRepository.findOne({ where: { nameEn: role_enum_1.default.User } });
        const newUser = new user_entity_1.UserEntity();
        Object.assign(newUser, createUserDto);
        newUser.confirmationCode = code;
        newUser.role = userRole;
        return await this.userRepository.save(newUser);
    }
    async findAll(req, usersQueryDto) {
        let { page, limit } = usersQueryDto;
        let filterParameters = Object.assign({}, usersQueryDto);
        page ? delete filterParameters.page : page = 1;
        limit ? delete filterParameters.limit : limit = 3;
        for (let parameter in filterParameters) {
            filterParameters[parameter] = (0, typeorm_2.Like)(`%${filterParameters[parameter]}%`);
        }
        return await this.userRepository.find({
            where: Object.assign({ id: (0, typeorm_2.Not)(req.user.id) }, filterParameters),
            relations: [
                'contactRequestFirstUser', 'contactRequestSecondUser'
            ],
            order: {
                id: 'ASC',
            },
            skip: (page - 1) * limit,
            take: limit
        });
    }
    async countAll(req) {
        return await this.userRepository.count({
            where: { id: (0, typeorm_2.Not)(req.user.id) },
        });
    }
    async findAllContacts(req, users) {
        const filter = [];
        users.map(user => {
            filter.push([
                { firstUser: { id: user.id }, secondUser: { id: req.user.id } },
                { secondUser: { id: user.id }, firstUser: { id: req.user.id } },
            ]);
        });
        const contactRequests = await this.contactRequestRepository.find({ where: filter });
        const filteredUsers = users.map(user => {
            let contactRequestFirstUser;
            let contactRequestSecondUser;
            for (let i = 0; i < contactRequests.length; i++) {
                for (let j = 0; j < user.contactRequestFirstUser.length; j++) {
                    if (contactRequests[i].id === user.contactRequestFirstUser[j].id) {
                        contactRequestFirstUser = contactRequests[i];
                    }
                }
            }
            for (let i = 0; i < contactRequests.length; i++) {
                for (let j = 0; j < user.contactRequestSecondUser.length; j++) {
                    if (contactRequests[i].id === user.contactRequestSecondUser[j].id) {
                        contactRequestSecondUser = contactRequests[i];
                    }
                }
            }
            if (contactRequestFirstUser) {
                user.contactRequestFirstUser = [contactRequestFirstUser];
            }
            else {
                user.contactRequestFirstUser = null;
            }
            if (contactRequestSecondUser) {
                user.contactRequestSecondUser = [contactRequestSecondUser];
            }
            else {
                user.contactRequestSecondUser = null;
            }
            return user;
        });
        return filteredUsers;
    }
    async findOne(id) {
        return await this.userRepository.findOne({
            where: { id: id },
            relations: ['role']
        });
    }
    generateConfirmationCode() {
        return Math.floor(Math.random() * (1000000 - 101010)) + 101010;
    }
};
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", user_entity_1.UserEntity)
], UsersService.prototype, "findCurrent", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, users_query_dto_1.UsersQueryDto]),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "findAll", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "countAll", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "findAllContacts", null);
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(contact_request_entity_1.ContactRequestEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(role_entity_1.RoleEntity)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map