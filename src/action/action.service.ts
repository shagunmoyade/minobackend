/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Users } from 'src/auth/auth.dto';
import {Server} from 'socket.io'


@Injectable()
export class ActionService {
  mysort = { createAt: -1 };
server: Server

  constructor(@InjectModel('Users') private authModel: Model<Users>) {}

  getuser(res) {
    this.authModel
      .find({})
      .sort({ createAt: -1 })
      .then((Data) => {
        if (Data) {
          const dashbardCount = {
            activeUser: Data.filter((x) => x.active == true).length,
            deactiveUser: Data.filter((x) => x.active == false).length,
            totalUser: Data.length,
            isadminUser: Data.filter((x) => x.isAdmin == true).length,
            issuperadminUser: Data.filter((x) => x.isSuperAdmin == true).length,
          };
          const responce = {
            dashboard: dashbardCount,
            data: Data,
            message: 'User List Found',
            status: true,
          };
          return res.send(responce);
        } else {
          const responce = {
            data: [],
            message: 'User List Empty',
            status: false,
          };
          return res.send(responce);
        }
      });
  }

  activateDeactivateUserbyID(res, req) {
    this.authModel
      .updateOne(
        { _id: new Types.ObjectId(req.id) },
        {
          $set: {
            active: req.status,
          },
        },
      )
      .then((Data) => {
        if (Data.matchedCount == 1) {
          if(req.status == false){
            // this.getway.disconnectwithsocket(req.id)
          }
          // if(req.status == true){
          // //   this.server.on('connection',(socket)=>{
          // //     // console.log(socket.query.empoyeeId);
          // //      console.log(req.id);
          // //     socket.join(req.id)  
          // // })
          // this.getway.connectwithsocket(req.id)
          // }else{
          // //   this.server.on('connection',(socket)=>{
          // //     // console.log(socket.query.empoyeeId);
          // //      console.log(req.id);
          // //     socket.leave(req.id)  
          // // })
          // this.getway.disconnectwithsocket(req.id)
          // }
          const responce = {
            data: Data,
            message: 'User Status Updated',
            status: true,
          };
          return res.send(responce);
        } else {
          const responce = {
            data: Data,
            message: 'User Not Found',
            status: false,
          };
          return res.send(responce);
        }
      });
  }

  makeUserAdmin(res, req) {
    this.authModel
      .updateOne(
        { _id: new Types.ObjectId(req.id) },
        {
          $set: {
            isAdmin: req.status,
          },
        },
      )
      .then((Data) => {
        if (Data.matchedCount == 1) {
          const responce = {
            data: Data,
            message: 'Status Updated',
            status: true,
          };
          return res.send(responce);
        } else {
          const responce = {
            data: Data,
            message: 'User Not Found',
            status: false,
          };
          return res.send(responce);
        }
      });
  }

  makeUserSuperAdmin(res, req) {
    this.authModel
      .updateOne(
        { _id: new Types.ObjectId(req.id) },
        {
          $set: {
            isSuperAdmin: req.status,
          },
        },
      )
      .then((Data) => {
        if (Data.matchedCount == 1) {
          const responce = {
            data: Data,
            message: 'Status Updated',
            status: true,
          };
          return res.send(responce);
        } else {
          const responce = {
            data: Data,
            message: 'User Not Found',
            status: false,
          };
          return res.send(responce);
        }
      });
  }


  getprofiledetails(auth,res){
const payload = this.getDataFromToken(auth)
this.authModel.find({_id : payload.id}).then((data:any) =>{
  if(data.length != 0){
    const responce = {
      data: data[0],
      message: 'User Found',
      status: true,
    };
    return res.send(responce);
  }else{
    const responce = {
      message: 'User not Found',
      status: false,
    };
    return res.send(responce);
  }
})

  }


  updateprofiledetails(res,body){
this.authModel.find({_id :  body.id }).then((data) =>{
  if(data.length != 0){
    if (body.password == body.confirmpassword) {
      this.authModel.updateOne({_id :  body.id},{
        $set: {
          password: body.password,
        fullname: body.fullname,
        confirmpassword: body.confirmpassword,
        image_url: body.image_url,
        active: true,
        isAdmin: false,
        socketConnected: false,
        isSuperAdmin: false,
        },
      }).then(Data =>{
        const responce = {
          message: 'User updated',
          status: true,
        };
        return res.send(responce);
      })
 
    } else {
      const responce = {
        message: 'Password and Confirmpassword Not Mached',
        status: false,
      };
      return res.send(responce);
    }
  }else{
    const responce = {
      message: 'User not Found',
      status: false,
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

}
