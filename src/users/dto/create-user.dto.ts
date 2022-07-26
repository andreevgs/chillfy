import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    readonly firstName: string;

    @IsNotEmpty()
    @IsString()
    readonly lastName: string;

    @IsNotEmpty()
    @IsString()
    readonly phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;
}
