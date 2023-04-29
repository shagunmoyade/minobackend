/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo, rseponceTodo } from './todo.dto';
import { TODOENUM } from './todo.dto';
import { Model, Types } from 'mongoose';

@Injectable()
export class TodoService {
  constructor(@InjectModel('todo') private todoModel: Model<Todo>) {}
  orderid: any;

  async getAllTodo(auth, res) {
    try{
      const paylod = await this.getDataFromToken(auth);
      this.todoModel.find({userId: paylod.id,isactive:true,isdelete:false}).limit(5).skip((2 - 1) * 5).then(async (Data) => {
        if (Data.length != 0) {
          // Data = Data.filter((x) => x.isactive == true && x.isdelete == false);
          const newData: any =  this.getresponce(Data);
          const responce = {
            data: newData,
            message: 'Todo Found',
            status: true,
          };
          return res.send(responce);
        } else {
          const responce = {
            data: Data,
            message: 'Todo Not Found',
            status: false,
          };
          return res.send(responce);
        }
      });
    }catch{

    }
   
  }

  async updateTODOStatus(res, req) {
    this.todoModel
      .updateOne(
        { _id: new Types.ObjectId(req.id) },
        {
          $set: {
            status: req.status,
          },
        },
      )
      .then((Data) => {
        if (Data.modifiedCount != 0 ) {
          const responce = {
            data: Data,
            message: 'Todo Status Updated',
            status: true,
          };
          return res.send(responce);
        } else {
          const responce = {
            data: Data,
            message: 'Todo Not Found',
            status: false,
          };
          return res.send(responce);
        }
      });
  }

  async addTODO(auth, res, req) {
    const paylod = await this.getDataFromToken(auth);
    if (paylod != null || paylod != undefined) {
      const TODO = new this.todoModel({
        userId: new Types.ObjectId(paylod.id),
        title: req.title,
        discription: req.discription,
        status: TODOENUM.Pending,
        isactive: true,
        isdelete: false,
        createAt: Date.now(),
      });
      TODO.save();
      const responce = {
        message: 'Todo Created',
        status: true,
      };
      return res.send(responce);
    } else {
      res.send(401, 'string');
    }
  }

 
 
 async getAllPendingTodo(auth,res,count,page){
  const paylod = await this.getDataFromToken(auth);
  let Count
 await this.todoModel.count({userId: paylod.id,isactive:true,isdelete:false,status:TODOENUM.Pending}).then(number => {
    Count = number
  })
  this.todoModel.find({userId: paylod.id,isactive:true,isdelete:false,status:TODOENUM.Pending}).limit(Number(count.count)).skip((Number(page.page) - 1) * Number(count.count)).then(async (Data) => {
    if (Data.length != 0) {
      // Data = Data.filter((x) => x.isactive == true && x.isdelete == false && x.status == TODOENUM.Pending);
      const newData: any =  this.getresponce(Data);
      const responce = {
        data: newData,
        message: 'Todo List Found',
        status: true,
       page: page.page,
        totalcount:  Count
      };
      return res.send(responce);
    } else {
      const responce = {
        data: Data,
        message: 'Todo Not Found',
        status: false,
      };
      return res.send(responce);
    }
  });
  }

  async getAllInrogressTodo(auth,res,count,page){
    const paylod = await this.getDataFromToken(auth);
    let Count
    await this.todoModel.count({userId: paylod.id,isactive:true,isdelete:false,status:TODOENUM.Inprogress}).then(number => {
      Count = number
    })
    this.todoModel.find({ userId: paylod.id,isactive:true,isdelete:false,status:TODOENUM.Inprogress}).limit(Number(count.count)).skip((Number(page.page) - 1) * Number(count.count)).then(async (Data) => {
      if (Data.length != 0) {
        // Data = Data.filter((x) => x.isactive == true && x.isdelete == false && x.status == TODOENUM.Inprogress);
        const newData: any =  this.getresponce(Data);
        const responce = {
          data: newData,
          message: 'Todo List Found',
          status: true,
          page: page.page,
          totalcount:  Count
        };
        return res.send(responce);
      } else {
        const responce = {
          data: Data,
          message: 'Todo Not Found',
          status: false,
        };
        return res.send(responce);
      }
    });
  }

  async getAllCompleteTodo(auth,res,count,page){
    const paylod = await this.getDataFromToken(auth);
    let Count
    await  this.todoModel.count({userId: paylod.id,isactive:true,isdelete:false,status:TODOENUM.Completed}).then(number => {
      Count = number
    })
    this.todoModel.find({ userId: paylod.id,isactive:true,isdelete:false,status:TODOENUM.Completed}).limit(Number(count.count)).skip((Number(page.page) - 1) * Number(count.count)).then(async (Data) => {
      if (Data.length != 0) {
        // Data = Data.filter((x) => x.isactive == true && x.isdelete == false && x.status == TODOENUM.Completed);
        const newData: any =  this.getresponce(Data);
        const responce = {
          data: newData,
          message: 'Todo List Found',
          status: true,
          page: page.page,
          totalcount:  Count
        };
        return res.send(responce);
      } else {
        const responce = {
          data: Data,
          message: 'Todo Not Found',
          status: false,
        };
        return res.send(responce);
      }
    });
  }


async deleteTodo(res,req){
this.todoModel.updateOne({_id: new Types.ObjectId(req.id)},{
  $set: {
    isactive: false,
    isdelete: true
  },
}).then((Data) => {
  if (Data.matchedCount == 1 && Data.modifiedCount == 1) {
    const responce = {
      data: Data,
      message: 'Todo Deleted',
      status: true,
    };
    return res.send(responce);
  } else {
    const responce = {
      data: Data,
      message: 'Todo Not Found',
      status: false,
    };
    return res.send(responce);
  }
});
}

async getTodobyId(res,req){
  this.todoModel.findOne({_id: new Types.ObjectId(req.id)}).then((Data) => {
    if (Data) {
      const responce = {
        data: Data,
        message: 'Todo Found',
        status: true,
      };
      return res.send(responce);
    } else {
      const responce = {
        message: 'Todo Not Found',
        status: false,
      };
      return res.send(responce);
    }
  });
  }


  async updateTodobyId(res, req) {
    this.todoModel
      .updateOne(
        { _id: new Types.ObjectId(req.id) },
        {
          $set: {
           title: req.title,
           discription: req.discription
          },
        },
      )
      .then((Data) => {
        if (Data.matchedCount == 1&& Data.modifiedCount == 1 ) {
          const responce = {
            data: Data,
            message: 'Todo Updated',
            status: true,
          };
          return res.send(responce);
        } else {
          const responce = {
            data: Data,
            message: 'Todo Not Found',
            status: false,
          };
          return res.send(responce);
        }
      });
  }

  getresponce(data) {
    const responcearray = [];
    data.forEach((element) => {
      const reponcetodo = new rseponceTodo();
      reponcetodo.discription = element.discription;
      reponcetodo._id = element._id;
      reponcetodo.userId = element.userId;
      reponcetodo.status = element.status;
      reponcetodo.statusName = element.status == '1'? 'Pending' : "1" &&element.status == '2'? 'Inprogress' : "2" &&element.status == '3'? 'Completed' : "3" ;
      reponcetodo.title = element.title;
      responcearray.push(reponcetodo);
    });
    return responcearray;
  }



  getDataFromToken(auth) {
    const jwt = auth.replace('Bearer ', '');
    const base64Payload = jwt.split('.')[1];
    const payloadBuffer = Buffer.from(base64Payload, 'base64');
    const updatedJwtPayload = JSON.parse(payloadBuffer.toString());
    return updatedJwtPayload;
  }

  
}
