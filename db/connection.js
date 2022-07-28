const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://ankan:ankan@cluster0.amccr.mongodb.net/?retryWrites=true&w=majority');
const conn=mongoose.connection;

conn.on('connected',()=>{
    console.log('db connected');
})

conn.on('error',()=>{
    console.log('db error');
})