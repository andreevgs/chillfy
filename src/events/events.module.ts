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

@Module({
    imports: [TypeOrmModule.forFeature([EventEntity, InvitationEntity, UserEntity, ContactRequestEntity])],
    controllers: [EventsController],
    providers: [EventsService, EmailingService, AccountService]
})
export class EventsModule {
}
