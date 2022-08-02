import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import {RoleEntity} from "./entities/role.entity";
import {ContactRequestEntity} from "../account/entities/contact-request.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, ContactRequestEntity])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
