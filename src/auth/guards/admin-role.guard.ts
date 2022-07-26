import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { UserRequestInterface } from '../../users/types/user-request.interface';
import RoleEnum from '../../users/enums/role.enum';

@Injectable()
export class AdminRoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<UserRequestInterface>();
        if (request.user.role.nameEn === RoleEnum.Admin) {
            return true;
        }
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
}
