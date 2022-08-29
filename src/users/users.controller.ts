import {Controller, Get, Param, Patch, Query, Req, UseGuards} from '@nestjs/common';
import {UsersService} from './users.service';
import {UserRequestInterface} from "./types/user-request.interface";
import {AccessTokenGuard} from "../auth/guards/access-token.guard";
import {UsersQueryDto} from "./dto/users-query.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get('current')
    @UseGuards(AccessTokenGuard)
    findCurrent(@Req() req: UserRequestInterface) {
        const user = this.usersService.findCurrent(req);
        return {user};
    }

    @Patch('current')
    @UseGuards(AccessTokenGuard)
    editCurrent(@Req() req: UserRequestInterface) {
        return {}
    }

    @UseGuards(AccessTokenGuard)
    @Get()
    async findAll(@Req() req: UserRequestInterface, @Query() usersQueryDto: UsersQueryDto) {
        const {page, limit} = usersQueryDto;
        const users = await this.usersService.findAll(req, usersQueryDto);
        const total = await this.usersService.countAll(req);
        const filteredUsers = users.length ? await this.usersService.findAllContacts(req, users) : [];
        return {users: filteredUsers, page: page ? +page : 1, limit: limit ? +limit : 3, total};
    }

    @UseGuards(AccessTokenGuard)
    @Get(':id')
    async findOne(@Req() req: UserRequestInterface, @Param('id') id: string) {
        const user = await this.usersService.findOne(+id);
        return {user};
    }
}
