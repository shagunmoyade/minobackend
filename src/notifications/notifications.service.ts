/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { notifications } from './notifications.dto';
import { Model, Types } from 'mongoose';
import { personalChat } from '../chat/chat.dto';

@Injectable()
export class NotificationsService {
constructor( @InjectModel('notifications') private notificationModel: Model<notifications>,@InjectModel('personalchat') private personalChat: Model<personalChat>){}


//// Funtion To Save Notification /////
addNotication(data:any){
const noti = new this.notificationModel({
    senderid: data.senderId,
    reciverid: data.reciverId,
    message : data.message,
    seen: false,
    createDate: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
})
noti.save()
}

async getmyallnotification(auth,res){
    const paylod = await this.getDataFromToken(auth);
    this.notificationModel.find({ reciverid : paylod.id}).sort({createDate: -1}).then((data) =>{
        if(data.length != 0){
            
            const responce = {
                data: data,
                message: 'Notification Found',
                status: true
              };
               res.send(responce);
               return this.updatestatus(data)
        }else{
            const responce = {
                message: 'Notification Not Found',
                status: false
              };
              return res.send(responce);
        }
    })
}

//// funtion to update seen staus /////
updatestatus(data:any){
     data.forEach(element => {
    this.notificationModel.updateOne(
        { _id: new Types.ObjectId(element._id) },
        {
          $set: {
            seen: true,
          },
        },
      ).then((data) =>{
        return data
      })
});
}

async getnotificationcount(auth,res){
  const paylod = await this.getDataFromToken(auth);
  this.notificationModel.find({ reciverid : paylod.id , seen:false}).then((data) =>{
    if(data.length != 0){
        const responce = {
            data: data.length,
            message: 'Notification count Found',
            status: true
          };
          return res.send(responce);
            
    }else{
        const responce = {
            message: 'Notification count Not Found',
            status: false
          };
          return res.send(responce);
    }
})
}

clearnotification(req,res){
this.notificationModel.deleteOne({_id : new Types.ObjectId(req.id)}).then((data) => {
  if(data.deletedCount != 0){
    const responce = {
      message: 'Notification Cleared',
      status: true
    };
    return res.send(responce);
  }else{
    const responce = {
      message: 'Notification not found',
      status: false
    };
    return res.send(responce);
  }
})
}


async clearallnotification(auth,res){
  const paylod = await this.getDataFromToken(auth);
  this.notificationModel.deleteMany({
    $or: [
      {senderid: { $regex: paylod.id } },
      { reciverid: { $regex: paylod.id } },
    ],
  }).then((data) => {
    if(data.deletedCount != 0 ){
      const responce = {
        message: 'Notification Cleared',
        status: true
      };
      return res.send(responce);
    }else{
      const responce = {
        message: 'Notification not found',
        status: false
      };
      return res.send(responce);
    }
  })
}





getDataFromToken(auth) {
    const jwt = auth.replace('Bearer ', '');
    const base64Payload = jwt.split('.')[1];
    const payloadBuffer = Buffer.from(base64Payload, 'base64');
    const updatedJwtPayload = JSON.parse(payloadBuffer.toString());
    return updatedJwtPayload;
  }




  //////////////////// Message Service //////////////////////
  async getmyallmsgnotification(auth,res){
    const paylod = await this.getDataFromToken(auth);
    this.personalChat.find({ 
      reciverid :new Types.ObjectId(paylod.id) ,seen : false}).sort({createAt: -1}).then((data) =>{
        if(data.length != 0){
            
            const responce = {
                data: data.length,
                message: 'Notification Found',
                status: true
              };
               res.send(responce);
              //  return this.updatestatus(data)
        }else{
            const responce = {
                message: 'Notification Not Found',
                status: false
              };
              return res.send(responce);
        }
    })
}




}
