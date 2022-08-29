import {
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {hash} from 'bcrypt';
import {RoleEntity} from "./role.entity";
import {RefreshTokenEntity} from "../../auth/entities/refresh-token.entity";
import {ContactRequestEntity} from "../../account/entities/contact-request.entity";
import {EventEntity} from "../../events/entities/event.entity";

@Entity({name: 'users'})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column({unique: true})
    phoneNumber: string;

    @Column({unique: true})
    username: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    password: string;

    @Column({nullable: true, default: null})
    confirmationCode?: number;

    @Column({default: false})
    isBlocked?: boolean;

    @Column({default: false})
    isConfirmed?: boolean;

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

    @ManyToOne(() => RoleEntity, role => role.users)
    role: RoleEntity;

    @OneToMany(() => RefreshTokenEntity, refreshToken => refreshToken.user)
    refreshToken: RefreshTokenEntity;

    @OneToMany(() => ContactRequestEntity, contactRequest => contactRequest.firstUser)
    contactRequestFirstUser: ContactRequestEntity[];

    @OneToMany(() => ContactRequestEntity, contactRequest => contactRequest.secondUser)
    contactRequestSecondUser: ContactRequestEntity[];

    @OneToMany(() => EventEntity, event => event.creator)
    events: EventEntity[];

    @OneToMany(() => ContactRequestEntity, contactRequest => contactRequest.secondUser)
    invitations: EventEntity[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        this.password = await hash(this.password, 10);
    }
}
