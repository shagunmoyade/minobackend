/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { Gateway } from './gatway';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema } from 'src/auth/auth.dto';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ChatModule } from 'src/chat/chat.module';




@Module({
    imports:[MongooseModule.forFeature([{ name: 'Users', schema: AuthSchema }]),NotificationsModule,ChatModule],
    providers :[Gateway]
})

export class GatewayModule {}
