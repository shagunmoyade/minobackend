/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
export const TODOSchema = new mongoose.Schema({
    userId:{ type: String, required: true},
    title: { type: String, required: true},
    discription: { type: String, required: true},
    status: {type: String, required: true},
    isactive: {type: Boolean, required: true},
    isdelete: {type: Boolean, required: true},
    createAt: {type: Date, required: true}
})

export class Todo {
    userId:string;
    title: string;
    discription: string;
    status: string;
    isactive: boolean;
    isdelete: boolean;
    createAt:Date
  }


  export class rseponceTodo {
    _id:string;
    userId:string;
    title: string;
    discription: string;
    status: string;
    statusName: string;
  }

  export enum TODOENUM {
    Pending = "1",
    Inprogress = "2",
    Completed = "3"
  }