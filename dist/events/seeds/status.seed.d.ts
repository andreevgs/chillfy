import { DataSource } from "typeorm";
export declare class StatusSeed {
    private dataSource;
    constructor(dataSource: DataSource);
    create(): Promise<void>;
}
