import { DataSource } from "typeorm";
export declare class UserSeed {
    private dataSource;
    constructor(dataSource: DataSource);
    create(): Promise<void>;
}
