import {Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {LoginUserDto} from "../users/dto/login-user.dto";
import {UsersService} from "../users/users.service";
import {UserRequestInterface} from "../users/types/user-request.interface";
import {RefreshTokenGuard} from "./guards/refresh-token.guard";
import {ConfirmationGuard} from "./guards/confirmation.guard";
import {ConfirmEmailDto} from "./dto/confirm-email.dto";
import {EmailingService} from "../emailing/emailing.service";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly emailingService: EmailingService,
    ) {
    }

    @Post('signup')
    async createUser(@Body('user') createAuthDto: CreateUserDto) {
        const code = this.usersService.generateConfirmationCode();
        const user = await this.usersService.createUser(createAuthDto, code);
        try {
            await this.emailingService.sendMail({
                to: createAuthDto.email,
                subject: 'Confirmation code',
                text: code.toString()
            });
        }
        catch {
            throw new HttpException('could not send email', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return {user}
    }

    @Post('signin')
    @HttpCode(200)
    async login(@Body('user') loginUserDto: LoginUserDto) {
        return await this.authService.login(loginUserDto);
    }

    @Post('code')
    @HttpCode(200)
    async sendConfirmationCode(@Body('user') loginUserDto: LoginUserDto) {
        const code = this.usersService.generateConfirmationCode();
        const createdConfirmationCodeResponse = await this.authService.createConfirmationCode(loginUserDto, code);
        try {
            await this.emailingService.sendMail({
                to: loginUserDto.email,
                subject: 'Confirmation code',
                text: code.toString()
            });
            return createdConfirmationCodeResponse;
        }
        catch {
            return {message: 'could not send email'};
        }
    }

    @Post('confirmation')
    @HttpCode(200)
    async confirmCode(@Body('confirmation') confirmEmailDto: ConfirmEmailDto) {
        return await this.authService.confirmationCode(confirmEmailDto);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('tokens')
    async getNewTokensPair(@Req() req: UserRequestInterface) {
        return await this.authService.getNewTokensPair(req);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('logout')
    async logOut(@Req() req: UserRequestInterface) {
        return await this.authService.logOut(req);
    }
}
