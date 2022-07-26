"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const ormconfig_1 = require("./ormconfig");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const seeds_module_1 = require("./shared/seeds/seeds.module");
const auth_middelware_1 = require("./auth/middlewares/auth.middelware");
const emailing_module_1 = require("./emailing/emailing.module");
const account_module_1 = require("./account/account.module");
const events_module_1 = require("./events/events.module");
const bull_1 = require("@nestjs/bull");
const redisconfig_1 = require("./redisconfig");
const events_gateway_1 = require("./events/gateways/events.gateway");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(auth_middelware_1.AuthMiddleware).forRoutes({
            path: '*',
            method: common_1.RequestMethod.ALL,
        });
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot(ormconfig_1.default),
            bull_1.BullModule.forRoot({ redis: redisconfig_1.default }),
            seeds_module_1.SeedsModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            emailing_module_1.EmailingModule,
            account_module_1.AccountModule,
            events_module_1.EventsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, events_gateway_1.EventsGateway],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map