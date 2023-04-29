/* eslint-disable prettier/prettier */

import * as mongoose from 'mongoose';

export const Notifications = new mongoose.Schema({
    senderid:{ type: String, required: true},
    reciverid: { type: String, required: true},
    message: { type: String, required: true},
    seen: {type: Boolean, required: true},
    createDate: {type: Date,required:true}
})

export class notifications {
    senderid: string;
    reciverid: string;
    message: string;
    seen:boolean;
    createDate: Date
  }