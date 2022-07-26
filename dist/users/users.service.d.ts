import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from "./entities/user.entity";
import { DataSource, Repository } from "typeorm";
import { UserRequestInterface } from "./types/user-request.interface";
import { RoleEntity } from "./entities/role.entity";
export declare class UsersService {
    private dataSource;
    private readonly userRepository;
    private readonly roleRepository;
    constructor(dataSource: DataSource, userRepository: Repository<UserEntity>, roleRepository: Repository<RoleEntity>);
    findCurrent(req: UserRequestInterface): UserEntity;
    createUser(createUserDto: CreateUserDto, code: number): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findOne(id: number): Promise<UserEntity>;
    generateConfirmationCode(): number;
}
