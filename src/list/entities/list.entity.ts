import { Board } from "src/board/entities/board.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('lists')
export class List {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text')
    title:string;
    
    @Column('bool',{
        default:true
    })
    isActive:boolean;

    @ManyToOne(
        () => Board,
        ( board ) => board.lists,
        { eager: true }
    )
    board: Board


}
