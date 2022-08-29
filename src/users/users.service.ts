import {Injectable, Req} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UserEntity} from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, Like, Not, Repository} from "typeorm";
import {UserRequestInterface} from "./types/user-request.interface";
import RoleEnum from "./enums/role.enum";
import {RoleEntity} from "./entities/role.entity";
import {ContactRequestEntity} from "../account/entities/contact-request.entity";
import {UsersQueryDto} from "./dto/users-query.dto";

@Injectable()
export class UsersService {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(ContactRequestEntity)
        private readonly contactRequestRepository: Repository<ContactRequestEntity>,
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>,
    ) {
    }

    findCurrent(@Req() req: UserRequestInterface): UserEntity {
        return req.user;
    }

    async createUser(createUserDto: CreateUserDto, code: number): Promise<UserEntity> {
        const userRole = await this.roleRepository.findOne({where: {nameEn: RoleEnum.User}});
        const newUser = new UserEntity();
        Object.assign(newUser, createUserDto);
        newUser.confirmationCode = code;
        newUser.role = userRole;
        return await this.userRepository.save(newUser);
    }

    async findAll(@Req() req: UserRequestInterface, usersQueryDto: UsersQueryDto): Promise<UserEntity[]> {
        let {page, limit} = usersQueryDto;
        let filterParameters = Object.assign({}, usersQueryDto);
        page ? delete filterParameters.page : page = 1;
        limit ? delete filterParameters.limit : limit = 3;

        for(let parameter in filterParameters){
            filterParameters[parameter] = Like(`%${filterParameters[parameter]}%`);
        }
        return await this.userRepository.find({
            where: {id: Not(req.user.id), ...filterParameters},
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

    async countAll(@Req() req: UserRequestInterface): Promise<number> {
        return await this.userRepository.count({
            where: {id: Not(req.user.id)},
        });
    }

    async findAllContacts(@Req() req: UserRequestInterface, users: UserEntity[]): Promise<UserEntity[]> {
        const filter = [];
        users.map(user => {
            filter.push([
                {firstUser: {id: user.id}, secondUser: {id: req.user.id}},
                {secondUser: {id: user.id}, firstUser: {id: req.user.id}},
            ]);
        });
        const contactRequests = await this.contactRequestRepository.find({where: filter});
        const filteredUsers = users.map(user => {
            let contactRequestFirstUser;
            let contactRequestSecondUser;

            for(let i = 0; i < contactRequests.length; i++){
                for(let j = 0; j < user.contactRequestFirstUser.length; j++){
                    if(contactRequests[i].id === user.contactRequestFirstUser[j].id){
                        contactRequestFirstUser = contactRequests[i];
                    }
                }
            }
            for(let i = 0; i < contactRequests.length; i++){
                for(let j = 0; j < user.contactRequestSecondUser.length; j++){
                    if(contactRequests[i].id === user.contactRequestSecondUser[j].id){
                        contactRequestSecondUser = contactRequests[i];
                    }
                }
            }
            if(contactRequestFirstUser){
                user.contactRequestFirstUser = [contactRequestFirstUser];
            } else {
                user.contactRequestFirstUser = null;
            }
            if(contactRequestSecondUser){
                user.contactRequestSecondUser = [contactRequestSecondUser];
            } else {
                user.contactRequestSecondUser = null;
            }
            return user;
        });
        return filteredUsers;
    }

    async findOne(id: number): Promise<UserEntity> {
        return await this.userRepository.findOne({
            where: {id: id},
            relations: ['role']
        });
    }

    generateConfirmationCode(): number {
        return Math.floor(Math.random() * (1000000 - 101010)) + 101010;
    }
}
