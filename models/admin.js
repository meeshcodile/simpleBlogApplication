const mongoose = require('mongoose')
const {Schema}= mongoose


const adminSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    }

})


const Admin = mongoose.model('admin', adminSchema)

module.exports = Admin



module.exports.comparePasswords = async(password, hashPassword)=>{
  try{
    return await bcrypt.compare(password, hashPassword)
  }catch(error){
    throw new Error("comparing failed", error)
  }
}