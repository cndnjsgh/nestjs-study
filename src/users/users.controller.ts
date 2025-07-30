import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { usersrequestdto } from 'src/DTO/users.request';
import { userresponesdto } from 'src/DTO/user.respones';
import { boardrequestdto } from 'src/DTO/board.request';
import { boardresponesdto } from 'src/DTO/board.repones';
import { allpostresponesdto } from 'src/DTO/all.post.respones';
import { userpostrequestsdto } from 'src/DTO/user.post.request';
import { userpostresponesdto } from 'src/DTO/user.post.respones';
import { updateboardresponseDTO } from 'src/DTO/update.board.response';
import { updateboardrequestDto } from 'src/DTO/update.board.request';
import { deleteboardresponesDTO } from 'src/DTO/delete.board.respones';
import { deleterequestDTO } from 'src/DTO/delete.request';
import { deleteuserrequestDTO } from 'src/DTO/delete.user.reqest';
import { deleteuserresponesDTO } from 'src/DTO/delete.user.respones';
import { userinforequestDTO } from 'src/DTO/userinfo.request';
import { userinforesponesDTO } from 'src/DTO/userinfo.respones';


@Controller('user')
export class UsersController { 
    constructor(private usersService: UsersService){}

    @Post('create_user') //회원가입
    async Ucreate(@Body() user: usersrequestdto):Promise<userresponesdto>{
        return await this.usersService.createuser(user);
    }

    @Post('create_post') //게시물 작성
    async Pcreate(@Body() post:boardrequestdto):Promise<boardresponesdto>{
        return await this.usersService.createboard(post);
    }
    //모든 게시물 조회
    @Get('all_post')
    async allpost():Promise<allpostresponesdto>{
        return await this.usersService.allpost();
    }
    //회원 정보 조회
    @Post('userinfo')
    async userinfo(@Body() body:userinforequestDTO):Promise<userinforesponesDTO>{
        return await this.usersService.userinfomation(body);
    }
    //특정 회원 게시물 조회
    @Post('user_post')
    async userpost(@Body() body:userpostrequestsdto):Promise<userpostresponesdto>{
        return await this.usersService.userpost(body);
    }
    //게시물 수정
    @Patch(':createnum')
    async updateboard(@Param('createnum')createnum:number, @Body() dto:updateboardrequestDto):Promise<updateboardresponseDTO>{
        return await this.usersService.update(createnum,dto);
    }
    //게시물 삭제
    @Delete('deletepost')
    async deleteboard(@Param('createnum')createnum:number,@Body() body:deleterequestDTO):Promise<deleteboardresponesDTO>{
        return await this.usersService.delete_board(createnum,body);
    }
    //회원 탈퇴
    @Delete('deleteuser')
    async deleteuser(@Query('PK')PK:number,@Body()body:deleteuserrequestDTO):Promise<deleteuserresponesDTO>{
        return await this.usersService.deleteU(PK,body);
    }
}
