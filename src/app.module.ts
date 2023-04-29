/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ActionModule } from './action/action.module';
import { TodoModule } from './todo/todo.module';
import { GatewayModule } from './gateway/gateway.module';
import { FriendsModule } from './friends/friends.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [AuthModule, MongooseModule.forRoot('mongodb+srv://shagunmoyade:9k66dW8pwap1L7vj@cluster0.bf5jiet.mongodb.net/test'), ActionModule, TodoModule, GatewayModule, FriendsModule, NotificationsModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// mongodb+srv://shagunmoyade:9k66dW8pwap1L7vj@cluster0.bf5jiet.mongodb.net/test