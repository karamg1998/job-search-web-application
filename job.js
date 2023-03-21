const express=require('express');
const sequelize=require('./database/db');
const bodyParser=require('body-parser');
const cors=require('cors');
const userRoutes=require('./routes/userRoutes');
const User=require('./models/user');
const info=require('./models/personalinfo');
const forgot=require('./models/forgotPass');

const app=express();
app.use(cors());
app.use(bodyParser.json());


app.use(userRoutes);

User.hasOne(info);
User.hasMany(forgot);
sequelize.sync().then(res=>{
    app.listen(3000);
}).catch(err=>console.log(err));