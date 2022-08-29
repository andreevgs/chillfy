import {IsDateString, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsDateString()
    date: Date;
}
