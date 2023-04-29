/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Users } from 'src/auth/auth.dto';
import { Friends, allfriends, friendstatus, searchFriend, searchFriendbyID, sentrecivedlist } from './friends.dto';
import { notifications } from 'src/notifications/notifications.dto';


@Injectable()
export class FriendsService {
  constructor(
    @InjectModel('Users') private userModel: Model<Users>,
    @InjectModel('Friends') private friendModel: Model<Friends>,
    @InjectModel('notifications') private notificationModel: Model<notifications>
  ) {}
recname
senname
  

  searchForFriends(search, res) {
    this.userModel
      .find({
        $or: [
          { fullname: { $regex: search.search } },
          { email: { $regex: search.search } },
        ],
      })
      .then((userList) => {
        if (userList.length != 0) {
          const finalRes =  this.getSearchData(userList)
          const responce = {
            data: finalRes,
            message: 'User Found',
            status: true,
          };
          return res.send(responce);
        } else {
          const responce = {
            message: 'User Not Found',
            status: false,
          };
          return res.send(responce);
        }
      });
  }

  async getfriendbyId(auth, id, res) {
    const payload = await this.getDataFromToken(auth);
    const frendres = await this.checkFriendship(payload, id);

    this.userModel.findOne({ _id: new Types.ObjectId(id.id) }).then((user) => {
      if (user) {
        const respond =  new searchFriendbyID();
        respond._id = user._id,
        respond.fullname = user.fullname
        respond.email = user.email
        respond.actionTaker = frendres
        respond.image_url= user.image_url
        const responce = {
          data: respond,
          message: 'User Found',
          status: true,
        };
        return res.send(responce);
      } else {
        const responce = {
          message: 'User Not Found',
          status: false,
        };
        return res.send(responce);
      }
    });
  }

 async sendFriendRequest(auth, id, res){
    const payload = await this.getDataFromToken(auth);
this.friendModel.find({
  sender: { $in: [payload.id, id.id] },
  reciver: { $in: [payload.id, id.id] },
}).then((data) => {
  if(data.length == 0){
    const newFriendRequest = new this.friendModel({
      sender: payload.id,
      reciver: id.id,
      status: friendstatus.Pending,
      createAt: Date.now()
    });
    newFriendRequest.save();
    // const data = {
    //   reciverId: id.id, 
    //   message: 'Request Sent', 
    //   senderId :payload.id ,
    // }
    // this.messageGateway.handleEvent(data)
    const responce = {
      message: 'Request Sent',
      status: true,
    };
    return res.send(responce);

  }else{
    const responce = {
      message: 'Already Sended',
      status: false,
    };
    return res.send(responce);
  }
})

  }

  async getsentrequest(auth,res,count,page){
    const payload = await this.getDataFromToken(auth);
    this.friendModel.aggregate(
      [  {
        "$match": {
          sender: new Types.ObjectId(payload.id) ,
          status : friendstatus.Pending
        }
      },
      {"$lookup": {
        "from": "users", 
        "localField": "reciver", 
        "foreignField": "_id", 
        "as": "usersName"
         }
}, { '$facet'    : {
  metadata: [ { $count: "total" }, { $addFields: { page: Number(page.page) } } ],
  data: [ { $skip:(Number(page.page) - 1) * Number(count.count)}, { $limit: Number(count.count) } ] // add projection here wish you re-shape the docs
}}
])
      // .limit(Number(count.count)).skip((Number(page.page) - 1) * Number(count.count))
    .then((data:any) => {
      if(data[0]['data'].length != 0){
        const finalRes =  this.sentlistmodification(data[0]['data'])
        const responce = {
          data : finalRes,
          message: 'sent list fount',
          status: true,
          page: page.page,
          totalcount:  data[0]['metadata'][0]['total']
        };
        return res.send(responce);
      }else{
        const responce = {
          message: 'sent list not fount',
          status: false,

        };
        return res.send(responce);  
      }
    })

  }


async getrecivedrequest(auth,res,count,page){
  const payload = await this.getDataFromToken(auth);
    this.friendModel.aggregate(
      // {sender : payload.id , status : friendstatus.Pending}
      [  {
        "$match": {
          reciver: new Types.ObjectId(payload.id) ,
          status : friendstatus.Pending
        }
      },
      {"$lookup": {
        "from": "users", 
        "localField": "sender", 
        "foreignField": "_id", 
        "as": "usersName"
         }
},{ '$facet'    : {
  metadata: [ { $count: "total" }, { $addFields: { page: Number(page.page) } } ],
  data: [ { $skip:(Number(page.page) - 1) * Number(count.count)}, { $limit: Number(count.count) } ] // add projection here wish you re-shape the docs
}}
])
// .limit(Number(count.count)).skip((Number(page.page) - 1) * Number(count.count))
    .then((data:any) => {
      if(data[0]['data'].length != 0){
        const finalRes =  this.sentlistmodification(data[0]['data'])
        const responce = {
          data : finalRes,
          message: 'recived list fount',
          status: true,
          page:  data[0]['metadata'][0]['page'],
          totalcount:  data[0]['metadata'][0]['total']
        };
        return res.send(responce);
      }else{
        const responce = {
          message: 'recived list not fount',
          status: false,
        };
        return res.send(responce);  
      }
    })
}


async acceptFriendRequest(req,res){
  this.friendModel.updateOne(
    { _id: new Types.ObjectId(req.id) },
    {
      $set: {
        status: friendstatus.Accepted,
      },
    }).then((data) => {
      if(data.modifiedCount != 0){
        const responce = {
          message: 'Request Accepted',
          status: true,
        };
        return res.send(responce);
      }else{
        const responce = {
          message: 'Request not found',
          status: false,
        };
        return res.send(responce); 
      }
    })
}

 rejectFriendRequest(req,res){
  this.clearnotification(req.id)
    this.friendModel.deleteOne(
      { _id: new Types.ObjectId(req.id) },
    ).then((data) => {
        if(data.deletedCount != 0){
          const responce = {
            message: 'Request Rejected',
            status: true,
          };
          return res.send(responce);
        }else{
          const responce = {
            message: 'Request not found',
            status: false,
          };
          return res.send(responce); 
        }
      })

}


async getallmyFriends(auth,res,count,page){
  const payload = await this.getDataFromToken(auth);
  this.friendModel.aggregate( [  {
    "$match": {
      $or: [ 
     {reciver: { $in: [new Types.ObjectId(payload.id)]}},
     { sender:{ $in:[new Types.ObjectId(payload.id)]}},
    ],
    status : friendstatus.Accepted 
    }
  }, {"$lookup":{
          "from": "users", 
          "pipeline":[{"$match":{"_id": { $nin:[new Types.ObjectId(payload.id)]}}}],
        "as": "usersName"
  }},{ '$facet'    : {
    metadata: [ { $count: "total" }, { $addFields: { page: Number(page.page) } } ],
    data: [ { $skip:(Number(page.page) - 1) * Number(count.count)}, { $limit: Number(count.count) } ]
  }}
]).then(async (data) =>{
  if(data[0]['data'].length != 0){
const reciverName = data[0]['data'].filter(x => x.sender == payload.id)
const senderName = data[0]['data'].filter(x => x.reciver == payload.id)

if(reciverName.length != 0){
   this.recname =  this.findrecivernameforfriendlist(reciverName)
}else{
  this.recname = []
}
if(senderName.length != 0){
  this.senname =  this.findsendernameforfriendlist(senderName)
 }else{
  this.senname = []
 }
 const responce = {
  data : [...this.recname,...this.senname ],
  message: 'Friend list fount',
  status: true,
  page:  data[0]['metadata'][0]['page'],
  totalcount:  data[0]['metadata'][0]['total']
};
return res.send(responce);
  }else{
       const responce = {
        message: 'Friend List not Found',
        status: false,
      };
      return res.send(responce);
  }
  })
}




async getallmyFriendsforchat(auth,res){
  const payload = await this.getDataFromToken(auth);
  this.friendModel.aggregate( [  {
    "$match": {
      $or: [ 
     {reciver: { $in: [new Types.ObjectId(payload.id)]}},
     { sender:{ $in:[new Types.ObjectId(payload.id)]}},
    ],
    status : friendstatus.Accepted 
    }
  }, {"$lookup":{
          "from": "users", 
          "pipeline":[{"$match":{"_id": { $nin:[new Types.ObjectId(payload.id)]}}}],
        "as": "usersName"
  }}, {"$lookup":{
    "from": "personalchats", 
    "pipeline":[{"$match":{"reciverid": new Types.ObjectId(payload.id),"seen": false}}],
     "as": "chatcount"
}}
]).then(async (data) =>{
  if(data.length != 0){
const reciverName = data.filter(x => x.sender == payload.id)
const senderName = data.filter(x => x.reciver == payload.id)

if(reciverName.length != 0){
   this.recname =  this.findrecivername(reciverName)
}else{
  this.recname = []
}
if(senderName.length != 0){
  this.senname =  this.findsendername(senderName)
 }else{
  this.senname = []
 }
 const responce = {
  data : [...this.recname,...this.senname ],
  // data : data,

  message: 'Friend list fount',
  status: true,
};
return res.send(responce);
  }else{
       const responce = {
        message: 'Friend List not Found',
        status: false,
      };
      return res.send(responce);
  }
  })
}










// Recivername ///
findrecivername(reciarray:any){
  const responcearray = [];
reciarray.forEach((element:any) => {
 const  recivername:any = element.usersName.filter(x => x._id  == (element.reciver).toString() )
 const msgrecived =  element.chatcount.filter(x => x.senderid == (element.reciver).toString())
 const list = new allfriends();
 list._id = element._id;
 list.sender = element.sender;
 list.reciver = element.reciver;
 list.msgcount = msgrecived.length
 list.name = recivername[0]['fullname'];
 list.image_url= recivername[0]['image_url']

 responcearray.push(list);
});
return responcearray;
}

findsendername(senname:any){
  const responcearray = [];
  senname.forEach((element:any) => {
   const  recivername:any = element.usersName.filter(x => x._id  == (element.sender).toString() )
 const msgrecived =  element.chatcount.filter(x => x.senderid == (element.sender).toString())

   const list = new allfriends();
   list._id = element._id;
   list.sender = element.sender;
   list.reciver = element.reciver;
 list.msgcount = msgrecived.length
   list.name = recivername[0]['fullname'];
 list.image_url= recivername[0]['image_url']

   responcearray.push(list);
  });
  return responcearray;
}


// Recivername ///
findrecivernameforfriendlist(reciarray:any){
  const responcearray = [];
reciarray.forEach((element:any) => {
 const  recivername:any = element.usersName.filter(x => x._id  == (element.reciver).toString() )
 const list = new allfriends();
 list._id = element._id;
 list.sender = element.sender;
 list.reciver = element.reciver;
 list.name = recivername[0]['fullname'];
 list.image_url= recivername[0]['image_url']
 responcearray.push(list);
});
return responcearray;
}

findsendernameforfriendlist(senname:any){
  const responcearray = [];
  senname.forEach((element:any) => {
   const  recivername:any = element.usersName.filter(x => x._id  == (element.sender).toString() )
   const list = new allfriends();
   list._id = element._id;
   list.sender = element.sender;
   list.reciver = element.reciver;
   list.name = recivername[0]['fullname'];
 list.image_url= recivername[0]['image_url']

   responcearray.push(list);
  });
  return responcearray;
}






  // Function //
  checkFriendship(payload, id) {
    const actionTaker = this.friendModel
      .find({
        sender: { $in: [payload.id, id.id] },
        reciver: { $in: [payload.id, id.id] },
        
      })
      .then((data:any) => {
        if(data.length != 0){
          if (data[0].sender == payload.id && data[0].reciver == id.id && data[0].status == friendstatus.Pending) {
            return 'Sender';
          } else if (data[0].reciver == payload.id && data[0].sender == id.id  && data[0].status == friendstatus.Pending) {
            return 'Reciver';
          }else{
            return 'Friends'
          }
          // else if (data[0].sender == payload.id && data[0].reciver == id.id && data[0].status == friendstatus.Accepted){
          //   return "Friends"
          // }
          // else if (data[0].reciver == payload.id && data[0].sender == id.id == id.id && data[0].status == friendstatus.Accepted){
          //   return "Friends"
          // }


        }else{
          if(payload.id == id.id){
            return "Can't Add"
          }else{
            return "Addfriend"

          }
        }
      });
    return actionTaker;
  }

  // Function //
  sentlistmodification(data){
    const responcearray = [];
    data.forEach((element) => {
      const list = new sentrecivedlist();
      list._id = element._id;
      list.sender = element.sender;
      list.reciver = element.reciver;
      list.name = element.usersName[0]['fullname'];
      list.status = element.status
      responcearray.push(list);
    });
    return responcearray;
  }

  

 ///// clearntification////
  clearnotification(id){
    this.friendModel.findById({_id : id}).then((data:any) =>{
      if(data != null){
this.notificationModel.deleteOne({
  senderid: { $in: [data.sender, data.reciver] },
  reciverid: { $in: [data.sender, data.reciver] },
}).then((data1) => {
  if(data1.deletedCount != 0){
return "Delete"
  }else {
    return "Not found"
  }
})}
    })
  }


  // Function //
  getSearchData(data){
    const responcearray = [];
    data.forEach((element) => {
      const reponcetodo = new searchFriend();
      reponcetodo._id = element._id;
      reponcetodo.email = element.email;
      reponcetodo.fullname = element.fullname;
      reponcetodo.image_url = element.image_url;
      responcearray.push(reponcetodo);
    });
    return responcearray;
  }
// Function //
  getDataFromToken(auth) {
    const jwt = auth.replace('Bearer ', '');
    const base64Payload = jwt.split('.')[1];
    const payloadBuffer = Buffer.from(base64Payload, 'base64');
    const updatedJwtPayload = JSON.parse(payloadBuffer.toString());
    return updatedJwtPayload;
  }
}
