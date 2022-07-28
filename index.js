const express=require('express');
const bodyParser = require('body-parser');
const cors=require('cors');
const app = express();
const dbconnection=require('./db/connection');

var port = process.env.PORT || 5000

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res) => {
    res.send('hii from server')
})
app.use('/auth',require('./routes/auth'));
app.use('/stock',require('./routes/stock'));



app.listen(port,()=>{
    console.log(`Server listening on port ${port}...`);
})
