/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { personalChat } from './chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class ChatService {
constructor(@InjectModel('personalchat') private personalChat: Model<personalChat>){}

    addpersonalchatmsg(data:any){
        const personal = new this.personalChat({
            senderid: data.senderId,
            reciverid: data.reciverId,
            message : data.message,
            seen: false,
            sendername: data.sendername,
            friendship: data.friendship,
            createAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
        })

        personal.save()
    }


    async getmyallmsgbyfriendid(id,res){
        // const paylod = await this.getDataFromToken(auth);
        this.personalChat.find({ 
      friendship
      :id.id}).sort({createAt: 1}).then((data) =>{
            if(data.length != 0){
                
                const responce = {
                    data: data,
                    message: 'Massage Found',
                    status: true
                  };
                   res.send(responce);
                // return this.updatemsgstatus(data)
            }else{
                const responce = {
                    message: 'Massage Not Found',
                    status: false
                  };
                  return res.send(responce);
            }
        })
      }



     async updateseenstatus(auth,id,res){
        const paylod = await this.getDataFromToken(auth);
        this.personalChat.updateMany({ 
            friendship : new Types.ObjectId(id.id), reciverid : new Types.ObjectId(paylod.id), seen: false},{
                                  $set: {
                                    seen: true,
                                  },
                                }).then((data) => {
                                    if(data.modifiedCount != 0){
                                        const responce = {
                                            data: true,
                                            message: 'status update',
                                            status: true
                                          };
                                           res.send(responce);
                                    }else{
                                        const responce = {
                                            message: 'Massage Not Found',
                                            status: false
                                          };
                                          return res.send(responce);
                                    }
                                })
      }


    //   ///// function to update msg status /////////
    //   updatemsgstatus(data:any){
    //     if(data.length != 0){
    //         data.forEach(element => {
    //             this.personalChat.updateOne(
    //                 { _id: new Types.ObjectId(element._id) },
    //                 {
    //                   $set: {
    //                     seen: true,
    //                   },
    //                 },
    //               ).then((data) =>{
    //                 return data
    //               })
    //         });
    //     }
        
    //   }

    getDataFromToken(auth) {
        const jwt = auth.replace('Bearer ', '');
        const base64Payload = jwt.split('.')[1];
        const payloadBuffer = Buffer.from(base64Payload, 'base64');
        const updatedJwtPayload = JSON.parse(payloadBuffer.toString());
        return updatedJwtPayload;
      }
    
}
