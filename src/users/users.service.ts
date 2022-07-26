import {Injectable, Req} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UserEntity} from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, Repository} from "typeorm";
import {UserRequestInterface} from "./types/user-request.interface";
import RoleEnum from "./enums/role.enum";
import {RoleEntity} from "./entities/role.entity";

@Injectable()
export class UsersService {
  constructor(
      private dataSource: DataSource,
      @InjectRepository(UserEntity)
      private readonly userRepository: Repository<UserEntity>,
      @InjectRepository(RoleEntity)
      private readonly roleRepository: Repository<RoleEntity>,
  ) {}

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

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({where: {id: id}, relations: ['role']});
  }

  generateConfirmationCode(): number {
    return Math.floor(Math.random() * (1000000 - 101010)) + 101010;
  }
}
