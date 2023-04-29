/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  orderid: any;
  constructor(
    @InjectModel('Users') private authModel: Model<Users>,
    private jwtService: JwtService,
  ) {}

  signup(res, signupdata) {
    this.authModel.findOne({ email: signupdata.email }).then((Data) => {
      if (!Data) {
        if (signupdata.password == signupdata.confirmpassword) {
          const newuser = new this.authModel({
            email: signupdata.email,
            password: signupdata.password,
            fullname: signupdata.fullname,
            confirmpassword: signupdata.confirmpassword,
            image_url: signupdata.image_url,
            active: false,
            isAdmin: false,
            socketConnected: false,
            isSuperAdmin: false,
            createAt: Date.now()
          });
          newuser.save();
          const responce = {
            message: 'User Created',
            status: true,
          };
          return res.send(responce);
        } else {
          const responce = {
            message: 'Password and Confirmpassword Not Mached',
            status: false,
          };
          return res.send(responce);
        }
      } else {
        const responce = {
          message: 'Email Already Used',
          status: false,
        };
        return res.send(responce);
      }
    });
  }

  loginuser(res, logindata) {
    this.authModel.findOne({ email: logindata.email }).then((Data) => {
      if (Data) {
        if (Data.password == logindata.password) {
          if (Data.active == true) {
            const payload = {
              username: Data.fullname,
              id: Data._id,
              password: Data.password,
            };
            const access_token = this.jwtService.sign(payload);
            const responce = {
              userData: Data,
              access_token: access_token,
              message: 'Welcome ' + Data.fullname,
              status: true,
            };
            return res.send(responce);
          } else {
            const responce = {
              message: 'User is Inactive',
              status: false,
            };
            return res.send(responce);
          }
        } else {
          const responce = {
            message: 'Incorrect Password',
            status: false,
          };
          return res.send(responce);
        }
      } else {
        const responce = {
          message: 'User Not Found',
          status: false,
        };
        return res.send(responce);
      }
    });
  }
}
