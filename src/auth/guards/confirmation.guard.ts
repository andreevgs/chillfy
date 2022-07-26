import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { UserRequestInterface } from '../../users/types/user-request.interface';

@Injectable()
export class ConfirmationGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<UserRequestInterface>();
        if (request.user.isConfirmed) {
            return true;
        }
        throw new HttpException({isConfirmed: request.user}, HttpStatus.FORBIDDEN);
    }
}
