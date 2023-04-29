/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

export const friends = new mongoose.Schema({
    sender:{ type: ObjectId, required: true},
    reciver: { type: ObjectId, required: true},
    status: { type: Number, required: true},
    createAt: {type: Date, required: true}
})


export class Friends {
    sender: object;
    reciver: object;
    status: string;
    createAt:Date
  }


  export class searchFriendbyID {
    _id : object;
    email: string;
    fullname: string;
    image_url: string;
    actionTaker:string;
  }
  export class searchFriend {
    _id : object;
    email: string;
    fullname: string;
    image_url: string;
  }
  export class sentrecivedlist {
    _id : object;
    sender: object;
    reciver: object;
    name: string;
    status: string
  }

  export class allfriends {
    _id : object;
    sender: object;
    reciver: object;
    name: string;
    msgcount:number;
    image_url: string;

  }

export enum friendstatus {
    Pending = 1,
    Accepted = 2,
    Rejected = 3
  }