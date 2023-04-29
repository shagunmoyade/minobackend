/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import {AuthSchema} from './auth.dto'
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Users', schema: AuthSchema }]),     PassportModule,JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '3h' },
  }),],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
 
})
export class AuthModule {}
