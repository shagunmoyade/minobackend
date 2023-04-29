/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDTO } from './dtos/login.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { extname, join } from 'path';


@Controller('auth')
export class AuthController {
constructor(private authservice :AuthService  ){}

    @Post('/signup')
    create(@Res() res ,@Body() createCatDto){
    this.authservice.signup(res ,createCatDto)
    }

    @Post('/login')
    login(@Res() res ,@Body() login: loginDTO){
    this.authservice.loginuser(res ,login)
    }

    @Post('uploadavtar')
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: 'avtars',
            filename: (req, file, callack) => {
              // Generating a 32 random chars long string
              const randomName = Array(32)
                .fill(null)
                .map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
              const filename =  `${randomName}${extname(file.originalname)}` 
       //Calling the callback passing the random name generated with the original extension name
       callack(null, filename)
            }
          })
        
    }))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  const res = {
    status: true,
    message: 'File Uploaded Sucessfully',
    file: file
  }
  return res
}


@Get('getavtar')
  getFile(@Query() filePath , @Res() res) {
    return res.sendFile(join(process.cwd(), filePath.filePath))
  }


}
