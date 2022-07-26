import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRequestInterface } from '../../users/types/user-request.interface';
import { UsersService } from '../../users/users.service';
import {AuthService} from "../auth.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
      private readonly userService: UsersService,
      private readonly authService: AuthService,
  ) {}

  async use(req: UserRequestInterface, _: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers.authorization.split(' ');
    const tokenType = token[0];

    let tokenValue = tokenType === 'Bearer' ? token[1] : null;
    try {
      const decode = jwt.verify(tokenValue, 'at_secret');
      req.user = await this.userService.findOne(decode['id']);
      next();
      return;
    } catch (err) {
      req.user = null;
    }
    try {
      const currentUser = await this.authService.verifyRefreshTokenAndGetUser(tokenValue);
      req.refreshToken = true;
      req.user = currentUser;
    } catch (err) {
      req.refreshToken = false;
    }
    next();
  }
}
