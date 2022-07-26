import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class AccessTokenGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
