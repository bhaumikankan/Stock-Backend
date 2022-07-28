const mongoose=require('mongoose');

const stockSchema=new mongoose.Schema({
    stockname:String,
    stockcode:String,
    var:String,
})

module.exports =  mongoose.model('Stock',stockSchema);