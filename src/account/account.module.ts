import {Module} from '@nestjs/common';
import {AccountService} from './account.service';
import {AccountController} from './account.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ContactRequestEntity} from "./entities/contact-request.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContactRequestEntity])],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService]
})
export class AccountModule {}
