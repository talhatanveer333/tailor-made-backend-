const mongoose = require('mongoose');
const Joi = require('joi');


const balancesheetSchema=mongoose.Schema({
    amount:{
        type:Number,
        default:0,
        required: true,
    },
    updateTime:{
        type:Date,
        default:Date.now(),
    }
});
const customerSchema=mongoose.Schema({
    no:{
        type:String,
        minLength:1,
        maxLength:255,
        require:true,
        unique:true,
    },
    name:{
        type:String,
        minLength:3,
        maxLength:255,
        require:true,
    },
    contact:{
        type:String,
        minLength:11,
        maxLength:11,
        default:'03XXXXXXXXX'
    },
    area:{
        type:String,
        minLength:1,
        maxLength:255,
        require:true,
    },
    address:{
        type:String,
        minLength:1,
        maxLength:255,
        default:' ',
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    business:{
        type: String,
        minLength: 3,
        maxLength: 255,
        require:true,
    },
    balancesheet:{
        type:balancesheetSchema,
        default:{ 
            amount:0,
            updateTime:Date.now(),
        }
    },
});

const Customer=mongoose.model('Customer', customerSchema);

function validateCustomer(customer){
    const schema=Joi.object({
        no: Joi.string().min(1).max(255).required(),
        name: Joi.string().min(3).max(255).required(),
        contact: Joi.string().min(11).max(11),
        area: Joi.string().min(3).max(255).required(),
        address: Joi.string().min(1).max(255),
        author: Joi.any().required(),
        business: Joi.string().min(3).max(255).required(),
        balancesheet: Joi.object(
            {
            amount: Joi.number(),
            updateTime: Joi.date(),
            }
        ),
    });

    return schema.validate(customer);
}

exports.Customer=Customer;
exports.validate=validateCustomer;