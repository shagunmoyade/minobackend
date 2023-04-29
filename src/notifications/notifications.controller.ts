/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards ,Headers,Res, Post, Req, Query} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { query } from 'express';

@Controller('notifications')
export class NotificationsController {

    constructor(private friendsService :NotificationsService ){}


    @UseGuards(JwtAuthGuard)
    @Get('getallnotification')
    getnotification(@Headers('Authorization') auth, @Res() res) {
        this.friendsService.getmyallnotification(auth,res)
    }

    @UseGuards(JwtAuthGuard)
    @Get('getnotificationcount')
    getnotificationcount(@Headers('Authorization') auth, @Res() res) {
        this.friendsService.getnotificationcount(auth,res)
    }
    @UseGuards(JwtAuthGuard)
    @Get('getmsgnotificationcount')
    getmsgnotificationcount(@Headers('Authorization') auth, @Res() res) {
        this.friendsService.getmyallmsgnotification(auth,res)
    }
    @UseGuards(JwtAuthGuard)
    @Post('clearnotificationt')
    clearnotification(@Query() req,@Res() res) {
        this.friendsService.clearnotification(req,res)
    }
    @UseGuards(JwtAuthGuard)
    @Post('clearallnotificationt')
    clearallnotification(@Headers('Authorization') auth,@Res() res) {
        this.friendsService.clearallnotification(auth,res)
    }
}
