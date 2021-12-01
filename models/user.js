const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const config=require('config');
const Joi = require('joi');


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
    firstName: {
        type: String,
        minLength: 3,
        maxLength: 25, 
        required: true,
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 25, 
        required: true,
    },
    type: {
        type: String,
        default: 'basic',
    },
});
userSchema.methods.generateAuthToken= function () {
    return jwt.sign({_id:this._id, isAdmin:this.type, firstName:this.firstName, lastName:this.lastName, email:this.email}, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

function validateUser(user)
{
    const schema = Joi.object({
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
        firstName: Joi.string().min(3).max(25).required(),
        lastName: Joi.string().min(3).max(25).required(),
        type: Joi.string(),
    });
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;