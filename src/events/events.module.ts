import {Module} from '@nestjs/common';
import {EventsService} from './events.service';
import {EventsController} from './events.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {EventEntity} from "./entities/event.entity";
import {InvitationEntity} from "./entities/invitation.entity";
import {EmailingService} from "../emailing/emailing.service";
import {UserEntity} from "../users/entities/user.entity";
import {AccountService} from "../account/account.service";
import {ContactRequestEntity} from "../account/entities/contact-request.entity";
import {BullModule} from "@nestjs/bull";
import {EventsProcessor} from "./processors/events.processor";

@Module({
    imports: [
        TypeOrmModule.forFeature([EventEntity, InvitationEntity, UserEntity, ContactRequestEntity]),
        BullModule.registerQueue({
            name: 'events',
        })
    ],
    controllers: [EventsController],
    providers: [EventsService, EmailingService, AccountService, EventsProcessor]
})
export class EventsModule {
}
