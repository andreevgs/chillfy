import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UsersService} from "../users/users.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../users/entities/user.entity";
import {RefreshTokenEntity} from "./entities/refresh-token.entity";
import {EmailingService} from "../emailing/emailing.service";
import {RoleEntity} from "../users/entities/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, RefreshTokenEntity])],
  controllers: [AuthController],
  providers: [AuthService, UsersService, EmailingService],
  exports: [AuthService],
})
export class AuthModule {}
