import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from "./entities/user.entity";
import { DataSource, Repository } from "typeorm";
import { UserRequestInterface } from "./types/user-request.interface";
import { RoleEntity } from "./entities/role.entity";
import { ContactRequestEntity } from "../account/entities/contact-request.entity";
import { UsersQueryDto } from "./dto/users-query.dto";
export declare class UsersService {
    private dataSource;
    private readonly userRepository;
    private readonly contactRequestRepository;
    private readonly roleRepository;
    constructor(dataSource: DataSource, userRepository: Repository<UserEntity>, contactRequestRepository: Repository<ContactRequestEntity>, roleRepository: Repository<RoleEntity>);
    findCurrent(req: UserRequestInterface): UserEntity;
    createUser(createUserDto: CreateUserDto, code: number): Promise<UserEntity>;
    findAll(req: UserRequestInterface, usersQueryDto: UsersQueryDto): Promise<UserEntity[]>;
    countAll(req: UserRequestInterface): Promise<number>;
    findAllContacts(req: UserRequestInterface, users: UserEntity[]): Promise<UserEntity[]>;
    findOne(id: number): Promise<UserEntity>;
    generateConfirmationCode(): number;
}
