import { UsersService } from './users.service';
import { UserRequestInterface } from "./types/user-request.interface";
import { UsersQueryDto } from "./dto/users-query.dto";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findCurrent(req: UserRequestInterface): {
        user: import("./entities/user.entity").UserEntity;
    };
    editCurrent(req: UserRequestInterface): {};
    findAll(req: UserRequestInterface, usersQueryDto: UsersQueryDto): Promise<{
        users: import("./entities/user.entity").UserEntity[];
        page: number;
        limit: number;
        total: number;
    }>;
    findOne(req: UserRequestInterface, id: string): Promise<{
        user: import("./entities/user.entity").UserEntity;
    }>;
}
