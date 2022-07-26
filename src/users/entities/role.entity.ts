import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {UserEntity} from "./user.entity";

@Entity({ name: 'roles'})
export class RoleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    nameRu: string;

    @Column()
    nameEn: string;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    public createdAt: Date;

    @OneToMany(() => UserEntity, user => user.role)
    users: UserEntity[]

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    public updatedAt: Date;
}
