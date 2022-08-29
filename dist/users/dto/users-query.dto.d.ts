import { PaginationQueryDto } from "../../shared/dto/pagination-query.dto";
export declare class UsersQueryDto extends PaginationQueryDto {
    username?: string;
    firstname?: string;
    lastname?: string;
}
