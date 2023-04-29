/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema } from 'src/auth/auth.dto';
import { friends } from './friends.dto';
import { Notifications } from 'src/notifications/notifications.dto';


@Module({
  imports:[MongooseModule.forFeature([{ name: 'Users', schema: AuthSchema },{ name: 'Friends', schema: friends },{ name: 'notifications', schema: Notifications }] )],
  providers: [FriendsService],
  controllers: [FriendsController]
})
export class FriendsModule {}
