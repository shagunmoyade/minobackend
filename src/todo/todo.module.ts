import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TODOSchema } from './todo.dto';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'todo', schema: TODOSchema }])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
