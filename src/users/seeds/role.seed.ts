import {Command} from 'nestjs-command';
import {Injectable} from '@nestjs/common';
import RoleEnum from "../enums/role.enum";
import {DataSource} from "typeorm";
import {RoleEntity} from "../entities/role.entity";

@Injectable()
export class RoleSeed {
    constructor(
        private dataSource: DataSource,
    ) {
    }

    @Command({command: 'create:roles', describe: 'create roles'})
    async create() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const createdAdminRole = new RoleEntity();
            const createdModeratorRole = new RoleEntity();
            const createdUserRole = new RoleEntity();
            Object.assign(createdAdminRole, {
                nameEn: RoleEnum.Admin,
                nameRu: null,
            });
            Object.assign(createdModeratorRole, {
                nameEn: RoleEnum.Moderator,
                nameRu: null,
            });
            Object.assign(createdUserRole, {
                nameEn: RoleEnum.User,
                nameRu: null,
            });
            await queryRunner.manager.save(createdAdminRole);
            await queryRunner.manager.save(createdModeratorRole);
            await queryRunner.manager.save(createdUserRole);
            await queryRunner.commitTransaction();
            console.log('created roles: ', createdAdminRole, createdModeratorRole, createdUserRole);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error('Error seeding data: ' + error);
        } finally {
            await queryRunner.release();
        }
    }
}