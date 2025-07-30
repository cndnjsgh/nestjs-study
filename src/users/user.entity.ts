import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Board } from "./board.entity";
import { usersrequestdto } from "src/DTO/users.request";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    PK: number;

    @Column()
    user_name: string;

    @Column()
    user_id: string;

    @Column()
    user_pw: string;

    @OneToMany(()=> Board,(board)=> board.user)
    board: Board[];

    setter(dto: usersrequestdto){
        this.user_id = dto.user_id;
        this.user_name = dto.user_name;
        this.user_pw = dto.user_pw;
    }
}