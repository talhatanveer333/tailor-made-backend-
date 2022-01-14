const mongoose=require('mongoose');
const Joi=require('joi');

const feedbackSchema= mongoose.Schema({
    comment:{
        type:String,
        required:true,
        minLength:1,
        maxLength:255,
    },
    reting:{
        type:Number,
        required:true,
        minLength:1,
        maxLength:5,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    for:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
});

const Feedback=mongoose.model('feedback', feedbackSchema);

function validateFeedback(feedback){
    const schema=Joi.object({
        comment:Joi.string().min(1).max(255).required(),
        rating:Joi.number().min(0).max(5).required(),
        author:Joi.any().required(),
        for:Joi.any().required(),
    });
    return schema.validate(feedback);
};

exports.Feedback=Feedback;
exports.validate=validateFeedback;