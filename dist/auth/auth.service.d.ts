import { UserEntity } from "../users/entities/user.entity";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { LoginUserDto } from "../users/dto/login-user.dto";
import { LoginResponseInterface } from "./types/login-response.interface";
import { RefreshTokenEntity } from "./entities/refresh-token.entity";
import { UserRequestInterface } from "../users/types/user-request.interface";
import { MessageResponseInterface } from "../shared/types/message-response.interface";
import { ConfirmEmailDto } from "./dto/confirm-email.dto";
import { ConfirmEmailForRestoringDto } from "./dto/confirm-email-for-restoring.dto";
import { RestoreDto } from "./dto/restore.dto";
export declare class AuthService {
    private dataSource;
    private readonly userRepository;
    private readonly refreshTokenRepository;
    constructor(dataSource: DataSource, userRepository: Repository<UserEntity>, refreshTokenRepository: Repository<RefreshTokenEntity>);
    login(loginUserDto: LoginUserDto): Promise<LoginResponseInterface>;
    createConfirmationCodeForRestoring(confirmEmailForRestoringDto: ConfirmEmailForRestoringDto, code: number): Promise<MessageResponseInterface>;
    createConfirmationCode(loginUserDto: LoginUserDto, code: number): Promise<MessageResponseInterface>;
    confirmationCode(confirmEmailDto: ConfirmEmailDto): Promise<MessageResponseInterface>;
    getNewTokensPair(req: UserRequestInterface): Promise<LoginResponseInterface>;
    restore(restoreDto: RestoreDto): Promise<MessageResponseInterface>;
    logOut(req: UserRequestInterface): Promise<MessageResponseInterface>;
    checkUserCredentials(loginUserDto: LoginUserDto): Promise<UserEntity>;
    checkUserEmailConfirmation(user: UserEntity): void;
    verifyRefreshTokenAndGetUser(refreshToken: string): Promise<UserEntity>;
    generateAccessToken(userEntity: UserEntity): string;
    generateRefreshTokenQueryRunner(userEntity: UserEntity, queryRunner: QueryRunner): Promise<string>;
}
