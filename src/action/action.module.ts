import { Module } from '@nestjs/common';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema } from 'src/auth/auth.dto';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Users', schema: AuthSchema }])],
  controllers: [ActionController],
  providers: [ActionService],
})
export class ActionModule {}
