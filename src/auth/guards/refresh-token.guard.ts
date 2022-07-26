import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { UserRequestInterface } from '../../users/types/user-request.interface';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<UserRequestInterface>();
        if (request.refreshToken) {
            return true;
        }
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
}
