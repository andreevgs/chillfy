import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {UserEntity} from "../../users/entities/user.entity";

@Entity({name: 'refresh_tokens'})
export class RefreshTokenEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: true})
    token: string;

    @Column({nullable: true})
    expirationDate: Date;

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

    @ManyToOne(() => UserEntity, user => user.refreshToken)
    user: UserEntity;
}