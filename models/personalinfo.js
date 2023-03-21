const Sequelize=require('sequelize');
const sequelize=require('../database/db');

const Personal=sequelize.define('personal',{
    id:{type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
        unique:true
    },
    name:Sequelize.STRING,
    email:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false,
    },
    phone:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false,
    },
    Graduation:Sequelize.STRING,
    specialization:Sequelize.STRING,
    Skills:Sequelize.STRING
});

module.exports=Personal;