const user=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

function generateToken(id)
{
    return jwt.sign({userid:id},'hffgjhfgjhfgj');
}

exports.addUser=async (req,res,next)=>{
 let pass=req.body.pass;
try{
    bcrypt.hash(pass,10,async(err,hash)=>{
        try{
            await user.create({
             name:req.body.name,
             email:req.body.email,
             password:hash,
             phone:req.body.phone,
             premiumUser:'false'
              }).then(user=>{
             res.json({success:true,message:"user singned up"});
             console.log('user signed up');
              });  
           }
           catch(err)
           {
             res.status(500).json(err);
             console.log('error in creating user');
           }
         })
    }  
    catch(err){
        console.log(err);
      }
};

exports.getUser=async (req,res,next)=>{
    let email=req.header('email');
    let pass=req.header('pass');
    await user.findOne({where:{email:email}})
    .then(user=>{
        if(!user)
        {
            res.json({message:'no user present'});
        }
        else{
            bcrypt.compare(pass,user.password,(err,response)=>{
                if(response===false)
                {
                  res.status(401).json({success:false,message:'wrong password'});
                  console.log('not mtched');
                  
                }
                if(response===true)
                {
                  res.status(200).json({success:true,message:'password matched',token:generateToken(user.id),name:user.name});
                  console.log('matched');
                }
                if(err)
                {
                  console.log(err);
                  res.status(500).json(err);
                }
            })
        }
    })
};