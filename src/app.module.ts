import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import ormconfig from "./ormconfig";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import {SeedsModule} from "./shared/seeds/seeds.module";
import {AuthMiddleware} from "./auth/middlewares/auth.middelware";
import {EmailingModule} from './emailing/emailing.module';
import {AccountModule} from './account/account.module';
import { EventsModule } from './events/events.module';
import {BullModule} from "@nestjs/bull";
import redisconfig from "./redisconfig";
import {EventsGateway} from "./events/gateways/events.gateway";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(ormconfig),
        BullModule.forRoot({redis: redisconfig}),
        SeedsModule,
        UsersModule,
        AuthModule,
        EmailingModule,
        AccountModule,
        EventsModule,
    ],
    controllers: [AppController],
    providers: [AppService, EventsGateway],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes({
            path: '*',
            method: RequestMethod.ALL,
        });
    }
}
