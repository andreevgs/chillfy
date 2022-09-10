import {IsDate, IsDateString, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UpdateEventDto {
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    name?: string;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsOptional()
    @IsDateString()
    date?: Date;
}
