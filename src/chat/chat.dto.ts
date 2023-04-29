/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

export const personalchat = new mongoose.Schema({
    senderid:{ type: ObjectId, required: true},
    reciverid: { type: ObjectId, required: true},
    friendship: {type: ObjectId, required: true},
    message: {type: String, required: true},
    sendername: {type: String, required: true},
    createAt: {type: Date, required: true},
    seen: {type: Boolean, required: true}

})

export class personalChat {
    senderid: object;
    reciverid: object;
    message: string;
    sendername: string;
    friendship:object;
    seen:boolean;
    createAt: Date
  }