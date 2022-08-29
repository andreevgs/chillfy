import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import {RoleSeed} from "../../users/seeds/role.seed";
import {UserSeed} from "../../users/seeds/user.seed";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../../users/entities/user.entity";
import {RoleEntity} from "../../users/entities/role.entity";
import {RefreshTokenEntity} from "../../auth/entities/refresh-token.entity";
import {StatusSeed} from "../../events/seeds/status.seed";

@Module({
    imports: [
        CommandModule,
        TypeOrmModule.forFeature([UserEntity, RoleEntity, RefreshTokenEntity]),
    ],
    providers: [RoleSeed, UserSeed, StatusSeed],
    exports: [RoleSeed, UserSeed, StatusSeed],
})
export class SeedsModule {}