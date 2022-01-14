const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const config=require('config');
const Joi = require('joi');


const addressSchema=mongoose.Schema({
    street:{
        type:String,
        maxLength:50
    },
    province:{
        type:String,
        maxLength:50
    },
    zip:{
        type:Number,
        maxLength:10
    },
    country:{
        type:String,
        maxLength:50
    }
})

// User model schema
const userSchema=new mongoose.Schema({
    email: {
        type: String,
        minLength: 3,
        maxLength: 255, 
        required: true,
        unique: true
    },
    password:{
        type: String,
        minLength: 8,
        maxLength: 255,
        required: true
    },
    name: {
        type: String,
        minLength: 3,
        maxLength: 25, 
        required: true,
    },    
    type: {
        type: String,
        default: 'basic',
    },
    address:{
        type:[addressSchema],
    },
    rating:{
        type:Number,
    }
});
userSchema.methods.generateAuthToken= function () {
    return jwt.sign({_id:this._id, type:this.type, firstName:this.name, email:this.email}, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

function validateUser(user)
{
    const schema = Joi.object({
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
        name: Joi.string().min(3).max(25).required(),        
        type: Joi.string(),
        address:Joi.object({
            street:Joi.string().max(50),
            province:Joi.string().max(30),
            zip:Joi.number().max(100000),
            country:Joi.string().max(50),
        }),
        rating:Joi.number().max(5),
    });
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;