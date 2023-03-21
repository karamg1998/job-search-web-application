const user=require('../models/user');
const forgot=require('../models/forgotPass');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

function generateToken(id)
{
    return jwt.sign({Id:id},'hffgjhfgjhfgj');
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

exports.forgotPass=async (req,res,next)=>{
  let email=req.body.email;
  let phone=req.body.phone;
  try{
  await  user.findOne({where:{email:email}})
  .then(user=>{
    if(!user)
    {
      res.status(404).json({success:false,message:'no user found'});
    }
    else{
      let Phone=user.phone;
      let id=user.id;
      if(Phone==phone)
      {
        forgot.create({active:'true'})
        .then(response=>{
          res.json({success:true,userToken:generateToken(id),forgot:generateToken(response.id),message:'success'});
        })
      }
      else{
        res.status(401).json({success:false,message:'phone number mismatched'});
      }
    }
  })
  }
  catch(err)
  {
    console.log(err);
    res.status(406).json(err);
  }
 
};

function parseToken(id)
{
  let parseId=jwt.verify(id,'hffgjhfgjhfgj');
  return parseId.Id;

}

exports.forgotSuccess=async (req,res,next)=>{
  let forgotId=parseToken(req.body.fToken);
  let userId=parseToken(req.body.userToken);
  let pass=req.body.password;
 try{
  await forgot.findOne({where:{id:forgotId}})
  .then(forgot=>{
    if(forgot.active=='true')
    {
      user.findOne({where:{id:userId}})
      .then(user=>{
        bcrypt.hash(pass,10,(err,hash)=>{
          if(!err)
          {
            user.update({password:hash})
            .then(resp=>{
              return forgot.update({active:'false'});
            })
            .then(f=>{
              res.json({success:true,message:'password changed successfully'});
            })
          }
          else
          {
            res.json({success:false,message:'error in changing password'});
          }
        })
      })
    }
    else
    {
      res.json({success:false,message:'link expired'})
    }
  })
 }
 catch(err)
 {
  res.json(err);
 }
};