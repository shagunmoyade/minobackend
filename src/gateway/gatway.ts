/* eslint-disable prettier/prettier */
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
// import { Headers } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Users } from 'src/auth/auth.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ChatService } from 'src/chat/chat.service';


@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class Gateway implements OnGatewayConnection {
  constructor(@InjectModel('Users') private authModel: Model<Users>, private notificationsService : NotificationsService, private chatservice :ChatService ) {}

  @WebSocketServer()
  server= new Server();


  handleConnection(@ConnectedSocket() client: any) {
    if(client.handshake.query.empoyeeId != undefined){
      // if(client.handshake.query.connect == "false"){
        // console.log(client.id);
        client.join(client.handshake.query.empoyeeId);
        client.emit("hi",{id:client.handshake.query.empoyeeId,msg:'connected'});
      // }
    }
  }

  // onModuleInit() {
 

  //   this.server.on('connection', (socket) => {
  //       console.log(socket.id);
  //     // if(socket.handshake.query.connect == "false"){
  //     //   socket.join(socket.handshake.query.empoyeeId);
  //     //   return  socket.emit("hi",{id:socket.handshake.query.empoyeeId,msg:'connected'});
        
  //       //  this.checkSocketConnection(socket.handshake.query.empoyeeId,true);     
  //     //  this.checkConnectCount()

  //     // }
  //   });
  // //   this.server.on('forceDisconnect', function(socket){
  // //     socket.disconnect();
  // //     this.checkConnectCount()

  // // });
  // }

  // connectwithsocket(id){
  //     this.server.on('connection',(socket)=>{
  //         // console.log(socket.query.empoyeeId);
  //          console.log(id);
  //         socket.join(id)
  //     })
  // }
  disconnectwithsocket(id){
      this.server.on('disconnection',(socket)=>{
          // console.log(socket.query.empoyeeId);
           console.log(id);
          //  socket.sockets[id].disconnect()
          socket.leave(id)
      })
      this.checkSocketConnection(id,false);
  }

  @SubscribeMessage('newMessage')
  handleEvent(@MessageBody() data: any) {
    const sended =  this.server
      .in(data.reciverId)
      .emit('newMessage1', { msg: data.message, by: data.senderId });
      if(sended == true){
      return this.notificationsService.addNotication(data)
      }
  }

  @SubscribeMessage('sendchat')
  handlechatEvent(@MessageBody() data: any) {
    const sended =  this.server
      .in(data.reciverId)
      .emit('newchat', { msg: data.message, by: data.senderId ,sendername:data.sendername});
      if(sended == true){
      return this.chatservice.addpersonalchatmsg(data)
      }
  }

  @SubscribeMessage('seenchat')
  handleseenchatEvent(@MessageBody() data: any) {
    return this.server
      .in(data.senderId)
      .emit('seennewchat', { msg: data.message});
      // if(sended == true){
      // return this.chatservice.addpersonalchatmsg(data)
      // }
  }




  // @SubscribeMessage('joingroup')
  // joingroupEvent(@MessageBody() data: any,@ConnectedSocket() client: any) {
  //   // const sended =  this.server
  //   //   .in(data.reciverId)
  //   //   .emit('newMessage1', { msg: data.message, by: data.senderId });
  //   //   if(sended == true){
  //   //   return this.notificationsService.addNotication(data)
  //   client.join(data.groupid);
  //   client.emit("addedingroup",{msg:data.msg});
  // }
  // @SubscribeMessage('leavegroup')
  // leavegroupEvent(@MessageBody() data: any,@ConnectedSocket() client: any) {
  //   // const sended =  this.server
  //   //   .in(data.reciverId)
  //   //   .emit('newMessage1', { msg: data.message, by: data.senderId });
  //   //   if(sended == true){
  //   //   return this.notificationsService.addNotication(data)
  //   client.leave(data.groupid);
  //   client.emit("leavefromgroup",{msg:data.msg});
  // }
  // @SubscribeMessage('newMessageingropu')
  // newMessageingropu(@MessageBody() data: any) {
  //   this.server
  //     .in(data.groupid)
  //     .emit('msgingroup', { msg: data.msg});
  //     // if(sended == true){
  //     // return this.notificationsService.addNotication(data)
  //     // }
      

  // }



  checkSocketConnection(id,value) {
    this.authModel
      .updateOne(
        { _id: new Types.ObjectId(id) },
        {
          $set: {
            socketConnected: value,
          },
        },
      ).then(data =>{
        return data
      })
  }

}



