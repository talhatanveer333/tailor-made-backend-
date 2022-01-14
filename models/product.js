const mongoose=require('mongoose');
const Joi=require('joi');

const productSchema= mongoose.Schema({
    name:{
        type:String,
        minLength:3,
        maxLength:255,
        required:true,
    },
    description:{
        type:String,
        minLength:1,
        maxLength:255,
        default: 'Nill',
    },
    price:{
        type:Number,
        min:1,
        required:true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    imageUrl:{
        type:String,
    }
});
// write any function required to embed to the model below

//////////////
const Product = mongoose.model('Product', productSchema);

function validateProduct(product){
    const schema= Joi.object({
        name: Joi.string().min(3).max(255).required(),
        description: Joi.string().min(1).max(255),
        price: Joi.number().integer().positive().required(),
        author: Joi.any(),
        imageUrl: Joi.string(),
    });
    return schema.validate(product);
}               

exports.Product=Product;
exports.validate=validateProduct;