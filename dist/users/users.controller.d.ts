import { UsersService } from './users.service';
import { UserRequestInterface } from "./types/user-request.interface";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findCurrent(req: UserRequestInterface): {
        user: import("./entities/user.entity").UserEntity;
    };
    findAll(): Promise<{
        users: import("./entities/user.entity").UserEntity[];
    }>;
    findOne(id: string): Promise<{
        user: import("./entities/user.entity").UserEntity;
    }>;
}
