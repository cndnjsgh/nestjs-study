import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Board{
    @PrimaryGeneratedColumn()
    createnum: number;

    @Column()
    description: string;

    @Column()
    user_naem:string;
    
    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @ManyToOne(() => User,{cascade:true})
    @JoinColumn()
    user: User;
}