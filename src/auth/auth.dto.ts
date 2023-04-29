/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

// export const AuthSchema = new mongoose.Schema({
//     email: { type: String, required: true},
//     password: { type: String, required: true},
//     firstName: {type: String, required: true},
//     lastName: {type: String, required: true},
//     image_url: {type: String, required: true},
// })

export const AuthSchema = new mongoose.Schema({
    email: { type: String, required: true},
    password: { type: String, required: true},
    fullname: {type: String, required: true},
    confirmpassword: {type: String, required: true},
    image_url: {type: String, required: true},
    active: {type: Boolean, required: true},
    isAdmin: {type: Boolean, required: true},
    socketConnected: {type: Boolean, required: true},
    isSuperAdmin: {type: Boolean, required: true},
    createAt: {type: Date, required: true}
})
export class Users {
    email: string;
    password: string;
    fullname: string;
    confirmpassword: string;
    image_url: string;
    active: boolean;
    isAdmin: boolean;
    socketConnected:boolean;
    isSuperAdmin: boolean;
    createAt:Date
  }