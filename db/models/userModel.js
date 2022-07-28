const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    email:String,
    password:String,
    stocks:[{type:mongoose.Schema.Types.ObjectId,ref:'Userstock'}]
})

module.exports =  mongoose.model('Suser',userSchema);