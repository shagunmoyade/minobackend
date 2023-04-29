/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Notifications } from './notifications.dto';
import { personalchat } from 'src/chat/chat.dto';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [MongooseModule.forFeature([{ name: 'notifications', schema: Notifications},{name: 'personalchat', schema: personalchat }])],
  exports: [NotificationsService]
})
export class NotificationsModule {}
