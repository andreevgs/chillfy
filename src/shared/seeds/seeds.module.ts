import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import {RoleSeed} from "../../users/seeds/role.seed";
import {UserSeed} from "../../users/seeds/user.seed";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../../users/entities/user.entity";
import {RoleEntity} from "../../users/entities/role.entity";
import {RefreshTokenEntity} from "../../auth/entities/refresh-token.entity";

@Module({
    imports: [
        CommandModule,
        TypeOrmModule.forFeature([UserEntity, RoleEntity, RefreshTokenEntity]),
    ],
    providers: [RoleSeed, UserSeed],
    exports: [RoleSeed, UserSeed],
})
export class SeedsModule {}