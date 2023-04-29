/* eslint-disable prettier/prettier */
import { Controller, Get, Res, UseGuards,Headers ,Body,Post, Query} from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { Todo } from './todo.dto';



@Controller('todo')
export class TodoController {
    constructor(private todoService:TodoService,){}

    @UseGuards(JwtAuthGuard)
    @Get('getAllTodo')
    getAllTodo(@Headers('Authorization') auth: string, @Res() res) {
        this.todoService.getAllTodo(auth,res)
    }

    @UseGuards(JwtAuthGuard)
    @Get('getAllPendingTodo')
    getAllPendingTodo(@Headers('Authorization') auth: string, @Res() res,@Query() count,@Query() page) {
        this.todoService.getAllPendingTodo(auth,res,count,page)
    }

    @UseGuards(JwtAuthGuard)
    @Get('getAllInrogressTodo')
    getAllInrogressTodo(@Headers('Authorization') auth: string, @Res() res,@Query() count,@Query() page) {
        this.todoService.getAllInrogressTodo(auth,res,count,page)
    }

    @UseGuards(JwtAuthGuard)
    @Get('getAllCompleteTodo')
    getAllCompleteTodo(@Headers('Authorization') auth: string, @Res() res,@Query() count,@Query() page) {
        this.todoService.getAllCompleteTodo(auth,res,count,page)
    }

    @UseGuards(JwtAuthGuard)
    @Post('addTodo')
    addTODO(@Headers('Authorization') auth: string, @Res() res,@Body() req:Todo) {
        this.todoService.addTODO(auth,res,req)
    }

    
    @UseGuards(JwtAuthGuard)
    @Post('updateStatus')
    updateTODOStatus(@Res() res,@Body() req) {
        this.todoService.updateTODOStatus(res,req)
    }


    @UseGuards(JwtAuthGuard)
    @Post('deleteTodo')
    deleteTODO(@Res() res,@Query() req) {
        this.todoService.deleteTodo(res,req)
    }

    @UseGuards(JwtAuthGuard)
    @Get('getTodobyId')
    getTodobyId(@Res() res,@Query() req) {
        this.todoService.getTodobyId(res,req)
    }
    

    @UseGuards(JwtAuthGuard)
    @Post('updateTodobyId')
    updateTodobyId(@Res() res,@Body() req) {
        this.todoService.updateTodobyId(res,req)
    }
    
}

