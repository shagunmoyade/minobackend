/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards ,Headers , Res, Req, Query, Post} from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
constructor(private friendsService :FriendsService ){}

    @UseGuards(JwtAuthGuard)
    @Get('searchfriend')
    searchForFriend(@Query() search, @Res() res) {
        this.friendsService.searchForFriends(search,res)
    }

    
    @UseGuards(JwtAuthGuard)
    @Get('getuserbyid')
    friendById(@Headers('Authorization') auth ,@Query() id, @Res() res) {
        this.friendsService.getfriendbyId(auth,id,res)
    }

        
    @UseGuards(JwtAuthGuard)
    @Post('sendfriendrequest')
    sendFriendRequest(@Headers('Authorization') auth ,@Query() id, @Res() res) {
        this.friendsService.sendFriendRequest(auth,id,res)
    }

    @UseGuards(JwtAuthGuard)
    @Get('getsentrequest')
    getsentrequest(@Headers('Authorization') auth,@Res() res,@Query() count,@Query() page) {
        this.friendsService.getsentrequest(auth,res,count,page)
    }
    @UseGuards(JwtAuthGuard)
    @Get('getrecivedrequest')
    getrecivedrequest(@Headers('Authorization') auth,@Res() res,@Query() count,@Query() page) {
        this.friendsService.getrecivedrequest(auth,res,count,page)
    }

    @UseGuards(JwtAuthGuard)
    @Get('acceptrequest')
    acceptFriendRequest(@Query() id, @Res() res) {
        this.friendsService.acceptFriendRequest(id,res)
    }
    @UseGuards(JwtAuthGuard)
    @Get('rejectrequest')
    rejectFriendRequest(@Query() id, @Res() res) {
        this.friendsService.rejectFriendRequest(id,res)
    }
    @UseGuards(JwtAuthGuard)
    @Get('getallmyfriends')
    getallmyFriend(@Headers('Authorization') auth,@Res() res,@Query() count,@Query() page) {
        this.friendsService.getallmyFriends(auth,res,count,page)
    }
    @UseGuards(JwtAuthGuard)
    @Get('getallmyfriendsforchat')
    getallmyFriendforchat(@Headers('Authorization') auth,@Res() res) {
        this.friendsService.getallmyFriendsforchat(auth,res)
    }
}
