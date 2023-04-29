/* eslint-disable prettier/prettier */

import { Controller, Get, Query, Res, UseGuards,Headers } from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {

    constructor(private chatService : ChatService){

    }
    @UseGuards(JwtAuthGuard)
    @Get('getmsgbyfriendid')
    getmsgbyfriendid(@Query() id, @Res() res) {
        this.chatService.getmyallmsgbyfriendid(id,res)
    }
    @UseGuards(JwtAuthGuard)
    @Get('updateseenstatusbyreciverid')
    updateseenstatusbyreciverid(@Headers('Authorization') auth, @Query() id,@Res() res) {
        this.chatService.updateseenstatus(auth,id,res)
    }
}
