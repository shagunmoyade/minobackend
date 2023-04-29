/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Res, UseGuards,Headers } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { ActionService } from './action.service';

@Controller('action')
export class ActionController {
constructor(private actionService:ActionService ){}
    @UseGuards(JwtAuthGuard)
    @Get('getAllUsers')
    getAllUser(@Res() res) {
this.actionService.getuser(res)
    }

    @UseGuards(JwtAuthGuard)
    @Post('activateDeactivateUser')
    activateUsers(@Res() res, @Body() req){
this.actionService.activateDeactivateUserbyID(res,req)
    }

//     @UseGuards(JwtAuthGuard)
//     @Post('deactivateUser')
//     deactivateUsers(@Res() res, @Query() id){
// this.actionService.deactivateUserbyID(res,id)
//     }

    @UseGuards(JwtAuthGuard)
    @Post('userAdminUpdate')
    makeuseradmin(@Res() res, @Body() req){
this.actionService.makeUserAdmin(res,req)
    }

    @UseGuards(JwtAuthGuard)
    @Post('userSuperAdminUpdate')
    makeuserSuperAdmin(@Res() res, @Body() req){
this.actionService.makeUserSuperAdmin(res,req)
    }

    @UseGuards(JwtAuthGuard)
    @Get('getprofiledetails')
    getprofileDetils(@Headers('Authorization') auth: string,@Res() res){
this.actionService.getprofiledetails(auth,res)
    }

    @UseGuards(JwtAuthGuard)
    @Post('updateprofiledetails')
    updateprofileDetils(@Res() res,@Body() body){
this.actionService.updateprofiledetails(res,body)
    }
//     @UseGuards(JwtAuthGuard)
//     @Post('adminToUser')
//     makeadminuser(@Res() res, @Query() id){
// this.actionService.makeAdminUser(res,id)
//     }
}
