/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { personalchat } from './chat.dto';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'personalchat', schema: personalchat }])],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService]
})
export class ChatModule {}
