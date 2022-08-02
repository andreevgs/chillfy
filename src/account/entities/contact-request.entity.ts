import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {UserEntity} from "../../users/entities/user.entity";

@Entity({name: 'contact_requests'})
export class ContactRequestEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.contactRequestFirstUser)
    firstUser: UserEntity;

    @ManyToOne(() => UserEntity, user => user.contactRequestSecondUser)
    secondUser: UserEntity;

    @Column({nullable: true, default: null})
    status: boolean;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    public createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    public updatedAt: Date;

    @DeleteDateColumn()
    public deletedAt: Date;
}