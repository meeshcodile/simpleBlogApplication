const Admin = require('../models/admin')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const MONGO_URL = require('../config/db').MONGOURL
mongoose.Promise = global.Promise

mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`database connected successfully`);
  })
  .catch(err => {
    console.log(`datbase connection failed ${err}`);
  });


  const admin = new Admin({
      email:'teapp.info@gmail.com',
      password:'aaa',
      username:'kwis'
  })
bcrypt.genSalt(10, (err, salt)=>{
    bcrypt.hash(admin.password, salt,(err, hash)=>{
        if(err){
            console.log(err)
        }
        admin.password = hash
        admin.save().then((admin)=>{
            console.log('admin created sucessfully')
        }).catch((err)=>{
            console.log('error saving user to the database')
        })
    })
})