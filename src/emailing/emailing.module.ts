import {Module} from '@nestjs/common';
import {EmailingService} from './emailing.service';

@Module({
    controllers: [],
    providers: [EmailingService],
    exports: [EmailingService]
})
export class EmailingModule {
}
