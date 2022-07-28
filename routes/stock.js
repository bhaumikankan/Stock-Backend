const router=require('express').Router();
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const stockModel= require('../db/models/stockModel');
const userModel= require('../db/models/userModel');
const userstockModel= require('../db/models/userstockModel');
const https = require('https');
const cheerio = require('cheerio');
const auth = require('../controller/authCheck')
const { default: mongoose } = require('mongoose');

//router-> http://localhost:5000/stock/uploadXL
/*router.get('/uploadXL', async(req,res)=>{

    try{
        const result = excelToJson({
        source: fs.readFileSync('var.xlsx') ,
        columnToKey: {
            A: 'stockname',
            C: 'stockcode',
            I: 'var'
        }
    });
    res.send(result.Sheet1);
    await stockModel.insertMany(result.Sheet1);
    }catch(err){
        res.send({ err:"server error"})
    }
    
    
})*/


//router-> http://localhost:5000/stock/getAll
router.get('/getAll',auth,async(req,res)=>{
    try{
        const data=await stockModel.find();
        res.send(data);
    }
    catch(err){
        res.send({ err:"server error"})
    }
})

//router-> http://localhost:5000/stock/getStock?sname=
router.get('/getStock',auth,async(req,res)=>{
    try{
        const stockname=req.query.sname;
        const stock=await stockModel.findOne({stockname:stockname});
        https.get(`https://api.bseindia.com/Msource/90D/getQouteSearch.aspx?Type=EQ&text=${stock.stockcode}&flag=gq`,(resp)=>{
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                const $ = cheerio.load(data);
                const text=($("li:first").text());
                const line=(`${text}`.split(" ").slice(-5,-4)[0])
                const code=line.toString().slice(-6)
                https.get(`https://api.bseindia.com/BseIndiaAPI/api/StockReachGraph/w?scripcode=${code}&flag=0&fromdate=&todate=&seriesid=`,(resp)=>{
                        let data = '';

                        resp.on('data', (chunk) => {
                            data += chunk;
                        });

                        resp.on('end', () => {
                            const obj={
                                "stockname":JSON.parse(data).Scripname,
                                "stockcode":stock.stockcode,
                                "bom":code,
                                "price":JSON.parse(data).CurrVal,
                                "var":stock.var
                            }
                            res.send(obj)
                        });
                    })
            });
        }).on("error", (err) => {
            res.send({ err:"server error"})
        });
    }
    catch(err){
        res.send({ err:"server error"})
    }
})

//router-> http://localhost:5000/stock/adduserStock/:id of user
router.post('/adduserStock/:id',auth,async(req,res)=>{
    try{
        const uid=req.params.id;
        const {stockname,quantity,VAR,bom}=req.body;
        const user=await userModel.findById(uid);
        const newUserstock=new userstockModel({stockname:stockname,quantity:quantity,var:VAR,bom:bom});
        const r=await newUserstock.save();
        user.stocks.push(r._id);
        await user.save();
        res.send({msg:"stock added successfully"})
    }catch(err){
        res.send({ err:"server error"})
    }
})

//router-> http://localhost:5000/stock/getuserStock/:id of user
router.get('/getuserStock/:id',auth,async(req,res)=>{
    try{
        const data = await userModel.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.id),
                }
            },
            {
                $lookup: {
                    from: "userstocks",
                    localField: "stocks",
                    foreignField: "_id",
                    as: "stockObj"
                },

            },

        ])
        res.send(data[0]);
    }catch(err){
        console.log(err);
        res.send({ err:"server error"})
    }
})



module.exports = router;