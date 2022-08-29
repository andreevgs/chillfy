import {PaginationQueryDto} from "../../shared/dto/pagination-query.dto";

export class UsersQueryDto extends PaginationQueryDto {
    username?: string;
    firstname?: string
    lastname?: string;
}