const router=require('express').Router();
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const saltRounds=10;
const userModel=require('../db/models/userModel');

//route-> http://localhost:5000/auth/register
router.post('/register',async (req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await userModel.findOne({email:email});
        if(user){
            res.send({msg:"user already exists"});
        }else{
            const hash=bcrypt.hashSync(password,saltRounds);
            const newUser=new userModel({email:email,password:hash});
            const user=await newUser.save();
            const token=jwt.sign({
                id: user._id,
            }, 'usersecret', { expiresIn: '12h' });
            res.send({token:token});
        }
        
    }catch(err){
        res.send({err:"server error"});
    }
})

//router-> http://localhost:5000/auth/login
router.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await userModel.findOne({email:email});
        if(user && bcrypt.compareSync(password,user.password)){
            const token=jwt.sign({
                id: user._id,
            }, 'usersecret', { expiresIn: '12h' });
            res.send({token:token});
        }else{
            res.send({msg:"invalid credentials"});
        }
    }catch(err){
        res.send({err:"server error"});
    }
});

//route-> http://localhost:5000/auth/verify
router.get('/verify',async(req,res)=>{
    try{
        jwt.verify(req.headers['x-auth-token'],'usersecret');
        res.send({islogin:true});
    }catch(err){
        res.send({islogin:false});
    }
})

module.exports =router;