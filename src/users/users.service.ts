import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { usersrequestdto } from 'src/DTO/users.request';
import { userresponesdto } from 'src/DTO/user.respones';
import { boardrequestdto } from 'src/DTO/board.request';
import { boardresponesdto } from 'src/DTO/board.repones';
import { Board } from './board.entity';
import { allpostresponesdto } from 'src/DTO/all.post.respones';
import { userpostrequestsdto } from 'src/DTO/user.post.request';
import { userpostresponesdto } from 'src/DTO/user.post.respones';
import { updateboardrequestDto } from 'src/DTO/update.board.request';
import { updateboardresponseDTO } from 'src/DTO/update.board.response';
import { deleteboardresponesDTO } from 'src/DTO/delete.board.respones';
import { deleterequestDTO } from 'src/DTO/delete.request';
import { create } from 'domain';
import { deleteuserrequestDTO } from 'src/DTO/delete.user.reqest';
import { deleteuserresponesDTO } from 'src/DTO/delete.user.respones';
import { userinforequestDTO } from 'src/DTO/userinfo.request';
import { userinforesponesDTO } from 'src/DTO/userinfo.respones';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
    ) {}
    //유저 생성
    async createuser(user:usersrequestdto):Promise<userresponesdto>{
        const userData:User = new User();
        userData.setter(user)
        await this.usersRepository.save(userData);
        const userre:userresponesdto = new userresponesdto();
        userre.user_name = userData.user_name;
        userre.text = '유저 생성에 성공하였습니다!';
        return userre;
    }
    //게시물 작성
    async createboard(post:boardrequestdto):Promise<boardresponesdto>{
        const findid = await this.usersRepository.findOne({ where: {user_id: post.user_id} }); //아이디 찾기
        const findpw = await this.usersRepository.findOne({ where: {user_pw: post.user_pw}  }); //비밀번호 찾기
        let text:boardresponesdto=new boardresponesdto();
        if(!findid||!findpw){  //아이디나 비번 일치하지 않으면 오류
            throw new BadRequestException('회원 정보가 일치하지 않습니다!');
        }
       const newboard = new Board();
       const user:User|null = await this.usersRepository.findOne({where: {user_id: post.user_id}});
       newboard.description = post.description;
       if(!user){
        throw new UnauthorizedException();
       }
       newboard.user=user;
       newboard.user_naem=post.user_name;
       await this.boardRepository.save(newboard);
       text.text='게시물을 작성했습니다!';
       return text;
    }
    //모든 게시물 조회
    async allpost():Promise<allpostresponesdto>{
        const post:Board[] = await this.boardRepository.find();
        if(post.length===0)
        {
            throw new NotFoundException('게시물이 존재하지 않습니다!');
        }
        const all_post:allpostresponesdto = new allpostresponesdto();
        all_post.post=post;
        return all_post;
    }  
    //특정 유저 조회
    async userinfomation(body:userinforequestDTO):Promise<userinforesponesDTO>{
        const user = await this.usersRepository.findOne({
            where:{user_id:body.user_id,user_pw:body.user_pw}
        });
        if(!user)
        {
            throw new NotFoundException('해당 유저가 존재하지 않습니다!');
        }
        const userinfo:userinforesponesDTO = new userinforesponesDTO();
        userinfo.PK=user.PK;
        userinfo.user_id=user.user_id;
        userinfo.user_pw=user.user_pw;
        userinfo.user_name=user.user_name;
        return userinfo;
    }
    //특정 유저 게시물 조회
    async userpost(body:userpostrequestsdto):Promise<userpostresponesdto>{
       const post = await this.boardRepository.find({
        where: {user:{user_id:body.user_id,user_pw:body.user_pw,user_name:body.user_name}}
       });
       const userpost:userpostresponesdto = new userpostresponesdto();
       userpost.post=post;
       return userpost;
    }
    //게시물 수정
    async update(createnum:number,dto:updateboardrequestDto):Promise<updateboardresponseDTO>{
        const findboard = await this.boardRepository.findOne({
            where: {createnum:createnum}
        });
        if(!findboard){
            throw new BadRequestException('해당 게시물이 존재하지 않습니다!');
        }
        await this.boardRepository.update({createnum},{description:dto.description});
        const text:updateboardresponseDTO = new updateboardresponseDTO();
        text.text='게시물 수정에 성공하였습니다!';
        return text;
    }
    //게시물 삭제
    async delete_board(createnum:number,body:deleterequestDTO):Promise<deleteboardresponesDTO>{
        const findboard = await this.boardRepository.findOne({
            where: {createnum:createnum}
        });
        if(!findboard){
            throw new NotFoundException('해당 게시물을 찾을 수 없습니다!');
        }
        const userinfo = await this.boardRepository.findOne({
            where:{createnum:createnum},
            select: {user:true}
        });
        if(userinfo==null)
        {
            throw new BadRequestException('게시물에 접근 권한이 없습니다!');
        }
        await this.boardRepository.delete(createnum);
        const success:deleteboardresponesDTO = new deleteboardresponesDTO();
        success.text='게시물 삭제에 성공하였습니다!';
        return success;
    }
    //회원 탈퇴
    async deleteU(PK:number,body:deleteuserrequestDTO):Promise<deleteuserresponesDTO>{
        const finduser = await this.usersRepository.findOne({
            where:{
                PK:PK,
                user_id:body.user_id,
                user_pw:body.user_pw,
                user_name:body.user_name
            },
        });
        if(!finduser)
        {
            throw new BadRequestException('접근 권한이 없습니다!');
        }
        const post = await this.boardRepository.find({
            where:{user:{user_id:body.user_id,user_pw:body.user_pw,user_name:body.user_name}}
        });
        await this.boardRepository.remove(post);
        await this.usersRepository.remove(finduser);
        const success:deleteuserresponesDTO = new deleteuserresponesDTO();
        success.text='회원 탈퇴에 성공하였습니다!';
        return success;
    }   
}
