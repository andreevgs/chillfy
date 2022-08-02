import {IsBoolean, IsNotEmpty} from "class-validator";

export class ChangeContactRequestDto {
    @IsNotEmpty()
    @IsBoolean()
    status: boolean;
}