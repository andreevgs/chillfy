import {Command} from 'nestjs-command';
import {Injectable} from '@nestjs/common';
import RoleEnum from "../enums/role.enum";
import {UserEntity} from "../entities/user.entity";
import {DataSource} from "typeorm";
import {RoleEntity} from "../entities/role.entity";
import {RefreshTokenEntity} from "../../auth/entities/refresh-token.entity";

@Injectable()
export class UserSeed {
    constructor(
        private dataSource: DataSource
    ) {
    }

    @Command({command: 'create:users', describe: 'create users'})
    async create() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const adminRole = await queryRunner.manager.findOne(RoleEntity, {where: {nameEn: RoleEnum.Admin}});
            const moderatorRole = await queryRunner.manager.findOne(RoleEntity, {where: {nameEn: RoleEnum.Moderator}});
            const userRole = await queryRunner.manager.findOne(RoleEntity, {where: {nameEn: RoleEnum.User}});

            const newAdmin = new UserEntity();
            const newModerator = new UserEntity();
            const newUser = new UserEntity();

            Object.assign(newAdmin, {
                username: 'admin',
                firstName: 'Admin',
                lastName: 'Admin',
                phoneNumber: '+375777777777',
                email: 'unicode256@yandex.by',
                password: '12345678',
                role: adminRole
            });
            Object.assign(newModerator, {
                username: 'moderator',
                firstName: 'Moderator',
                lastName: 'Moderator',
                phoneNumber: '+375777777778',
                email: 'unicode257@yandex.by',
                password: '12345678',
                role: moderatorRole
            });
            Object.assign(newUser, {
                username: 'user',
                firstName: 'User',
                lastName: 'User',
                phoneNumber: '+375777777779',
                email: 'unicode258@yandex.by',
                password: '12345678',
                role: userRole
            });
            const createdAdmin = await queryRunner.manager.save(newAdmin);
            const createdModerator = await queryRunner.manager.save(newModerator);
            const createdUser = await queryRunner.manager.save(newUser);

            const adminRefreshToken = new RefreshTokenEntity();
            const moderatorRefreshToken = new RefreshTokenEntity();
            const userRefreshToken = new RefreshTokenEntity();

            Object.assign(adminRefreshToken, {
                token: null,
                expirationDate: null,
                user: createdAdmin
            });
            Object.assign(moderatorRefreshToken, {
                token: null,
                expirationDate: null,
                user: createdModerator
            });
            Object.assign(userRefreshToken, {
                token: null,
                expirationDate: null,
                user: createdUser
            });
            await queryRunner.manager.save(adminRefreshToken);
            await queryRunner.manager.save(moderatorRefreshToken);
            await queryRunner.manager.save(userRefreshToken);
            await queryRunner.commitTransaction();
            console.log('created users: ', newAdmin, newModerator, newUser);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error('Error seeding data: ' + error);
        } finally {
            await queryRunner.release();
        }
    }
}