import {HttpException, HttpStatus, Injectable, Req} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../users/entities/user.entity";
import {DataSource, QueryRunner, Repository} from "typeorm";
import {LoginUserDto} from "../users/dto/login-user.dto";
import {LoginResponseInterface} from "./types/login-response.interface";
import * as jwt from 'jsonwebtoken';
import {compare, hash} from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import {RefreshTokenEntity} from "./entities/refresh-token.entity";
import {UserRequestInterface} from "../users/types/user-request.interface";
import {MessageResponseInterface} from "../shared/types/message-response.interface";
import {ConfirmEmailDto} from "./dto/confirm-email.dto";
import {ConfirmEmailForRestoringDto} from "./dto/confirm-email-for-restoring.dto";
import {RestoreDto} from "./dto/restore.dto";

@Injectable()
export class AuthService {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(RefreshTokenEntity)
        private readonly refreshTokenRepository: Repository<RefreshTokenEntity>
    ) {
    }

    async login(loginUserDto: LoginUserDto): Promise<LoginResponseInterface> {
        const user = await this.checkUserCredentials(loginUserDto);
        this.checkUserEmailConfirmation(user);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const refreshToken = await this.generateRefreshTokenQueryRunner(user, queryRunner);
            await queryRunner.commitTransaction();
            return {
                accessToken: this.generateAccessToken(user),
                refreshToken,
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error('Error during login. ' + error);
        } finally {
            await queryRunner.release();
        }
    }

    async createConfirmationCodeForRestoring(
        confirmEmailForRestoringDto: ConfirmEmailForRestoringDto, code: number
    ): Promise<MessageResponseInterface> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        let responseMessage = '';
        try {
            await queryRunner.manager.update(
                UserEntity,
                {email: confirmEmailForRestoringDto.email},
                {confirmationCode: code},
            );
            await queryRunner.commitTransaction();
            responseMessage = 'confirmation code was sent';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            responseMessage = 'error creating confirmation code';
        } finally {
            await queryRunner.release();
        }
        return {message: responseMessage}
    }

    async createConfirmationCode(loginUserDto: LoginUserDto, code: number): Promise<MessageResponseInterface> {
        const user = await this.checkUserCredentials(loginUserDto);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        let responseMessage = '';
        try {
            await queryRunner.manager.update(
                UserEntity,
                {id: user.id},
                {confirmationCode: code},
            );
            await queryRunner.commitTransaction();
            responseMessage = 'confirmation code was sent';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            responseMessage = 'error creating confirmation code';
        } finally {
            await queryRunner.release();
        }
        return {message: responseMessage}
    }

    async confirmationCode(confirmEmailDto: ConfirmEmailDto): Promise<MessageResponseInterface> {
        const user = await this.checkUserCredentials(confirmEmailDto);
        if (user.confirmationCode !== confirmEmailDto.code) {
            throw new HttpException('wrong code', HttpStatus.FORBIDDEN);
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        let responseMessage = '';

        try {
            await queryRunner.manager.update(
                UserEntity,
                {id: user.id},
                {isConfirmed: true},
            );
            await queryRunner.commitTransaction();
            responseMessage = 'email was confirmed successfully';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            responseMessage = 'error during confirmation';
        } finally {
            await queryRunner.release();
        }
        return {message: responseMessage}
    }

    async getNewTokensPair(@Req() req: UserRequestInterface): Promise<LoginResponseInterface> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const refreshToken = await this.generateRefreshTokenQueryRunner(req.user, queryRunner);
            await queryRunner.commitTransaction();
            return {
                accessToken: this.generateAccessToken(req.user),
                refreshToken,
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error('Error getting new tokens pair. ' + error);
        } finally {
            await queryRunner.release();
        }
    }

    async restore(restoreDto: RestoreDto): Promise<MessageResponseInterface> {
        restoreDto.newPassword = await hash(restoreDto.newPassword, 10);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        let responseMessage = '';
        try {
            const updatedUser = await queryRunner.manager.update(
                UserEntity,
                {email: restoreDto.email, confirmationCode: restoreDto.confirmationCode},
                {password: restoreDto.newPassword},
            );
            if(!updatedUser.affected){
                throw new Error();
            }
            await queryRunner.commitTransaction();
            responseMessage = 'ok';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            responseMessage = 'error during restoring';
        } finally {
            await queryRunner.release();
        }
        return {message: responseMessage};
    }

    async logOut(@Req() req: UserRequestInterface): Promise<MessageResponseInterface> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        let responseMessage = '';
        try {
            await queryRunner.manager.update(
                RefreshTokenEntity,
                {user: req.user},
                {token: null, expirationDate: null},
            );
            await queryRunner.commitTransaction();
            responseMessage = 'ok';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            responseMessage = 'error during logout';
        } finally {
            await queryRunner.release();
        }
        return {message: responseMessage};
    }

    async checkUserCredentials(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: {
                email: loginUserDto.email
            }
        });
        const isPasswordCorrect = await compare(
            loginUserDto.password,
            user.password,
        );
        if (!isPasswordCorrect) {
            throw new HttpException('wrong email or password', HttpStatus.FORBIDDEN);
        }
        return user;

    }

    checkUserEmailConfirmation(user: UserEntity): void {
        if (!user.isConfirmed) {
            throw new HttpException({isConfirmed: user.isConfirmed}, HttpStatus.FORBIDDEN);
        }
    }

    async verifyRefreshTokenAndGetUser(refreshToken: string): Promise<UserEntity> {
        const storedRefreshToken = await this.refreshTokenRepository.findOne({
            where: {token: refreshToken},
            relations: ['user'],
        });
        if (!storedRefreshToken) throw new Error();
        if (storedRefreshToken.expirationDate.getTime() < new Date().getTime()) throw new Error();
        return storedRefreshToken.user;
    }

    generateAccessToken(userEntity: UserEntity): string {
        return jwt.sign(
            {
                id: userEntity['id'],
                email: userEntity.email,
            },
            process.env.JWT_AT_SECRET,
            {
                expiresIn: '7d',
            }
        );
    }

    async generateRefreshTokenQueryRunner(userEntity: UserEntity, queryRunner: QueryRunner): Promise<string> {
        let expiredAt = new Date(Date.now() + parseInt(process.env.JWT_RT_EXPIRATION_MIN) * 60000);
        let token = uuidv4();
        await queryRunner.manager.update(
            RefreshTokenEntity,
            {user: userEntity},
            {token: token, expirationDate: expiredAt},
        );
        return token;
    }
}
