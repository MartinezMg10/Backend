import { Board } from "src/board/entities/board.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        unique:true
    })
    email:string;

    @Column('text',{
        select:false
    })
    password:string;

    @Column('text')
    firstName:string;

    @Column('text')
    lastName:string;

    @Column('bool',{
        default:true
    })
    isActive:boolean;

    @Column('text',{
        array:true,
        default: ['user']
    })
    roles:string[];

    @OneToMany(
        () => Board,
        ( board ) => board.user
    )
    board: Board;

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdatet(){
        this.checkFieldsBeforeInsert();
    }


}

