import { DataSource } from "typeorm";
export declare class RoleSeed {
    private dataSource;
    constructor(dataSource: DataSource);
    create(): Promise<void>;
}
