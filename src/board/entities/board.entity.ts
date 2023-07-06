import { User } from "src/auth/entities/user.entity";
import { List } from "src/list/entities/list.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('boards')
export class Board {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text')
    title:string;

    @Column('text',)
    description:string;

    @Column('bool',{
        default:true
    })
    isActive:boolean;

    @Column('text')
    image_url: string;

    @Column('text',{
        default:'public'
    })
    visibility:string;

    @ManyToOne(
        () => User,
        ( user ) => user.board,
        { eager: true }
    )
    user: User

    @OneToMany(
        () => List,
        ( list ) => list.board
    )
    lists: List[];

}
