import {Command} from 'nestjs-command';
import {Injectable} from '@nestjs/common';
import StatusEnum from "../enums/status.enum";
import {DataSource} from "typeorm";
import {StatusEntity} from "../entities/status.entity";

@Injectable()
export class StatusSeed {
    constructor(
        private dataSource: DataSource,
    ) {
    }

    @Command({command: 'create:statuses', describe: 'create statuses'})
    async create() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const createdNoAnswerStatus = new StatusEntity();
            const createdCanNotStatus = new StatusEntity();
            const createdMostLikelyStatus = new StatusEntity();
            const createdDefinitelyAttendStatus = new StatusEntity();

            Object.assign(createdNoAnswerStatus, {
                nameEn: StatusEnum.NoAnswer,
                nameRu: null,
            });
            Object.assign(createdCanNotStatus, {
                nameEn: StatusEnum.CanNot,
                nameRu: null,
            });
            Object.assign(createdMostLikelyStatus, {
                nameEn: StatusEnum.MostLikely,
                nameRu: null,
            });
            Object.assign(createdDefinitelyAttendStatus, {
                nameEn: StatusEnum.DefinitelyAttend,
                nameRu: null,
            });

            await queryRunner.manager.save(createdNoAnswerStatus);
            await queryRunner.manager.save(createdCanNotStatus);
            await queryRunner.manager.save(createdMostLikelyStatus);
            await queryRunner.manager.save(createdDefinitelyAttendStatus);
            await queryRunner.commitTransaction();
            console.log('created roles: ', createdNoAnswerStatus, createdCanNotStatus, createdMostLikelyStatus, createdDefinitelyAttendStatus);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error('Error seeding data: ' + error);
        } finally {
            await queryRunner.release();
        }
    }
}