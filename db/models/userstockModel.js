const mongoose=require('mongoose');

const userstockSchema=new mongoose.Schema({
    stockname:String,
    bom:String,
    quantity:{type:Number,default:0},
    var:String,
    
})

module.exports =  mongoose.model('Userstock',userstockSchema);