const mongoose=require('mongoose');
const Joi=require('joi');

const inventorySchema=mongoose.Schema({
    au:{
        type:Number,
        min:0,
        default:0
    },
    modifiedDate:{
        type:Date,
        default:Date.now(),
    },
    place:{
        type:String,
        minLength:0,
        maxLength:255,
        default:' ',
    },
    worth:{
        type:Number,
        min:0,
        default:0
    }
});
const productSchema= mongoose.Schema({
    name:{
        type:String,
        minLength:3,
        maxLength:255,
        required:true,
        unique:true
    },
    upc:{
        type:Number,
        min:1,
        required:true,
        default:1
    },
    description:{
        type:String,
        minLength:1,
        maxLength:255,
        default: 'Nill',
    },
    pp:{
        type:Number,
        min:1,
        required:true,
    },
    sp:{
        type:Number,
        min:1,
        required:true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    business:{
        type: String,
        minLength: 3,
        maxLength: 255
    },
    inventory:{
        type:inventorySchema,
    }
});
// write any function required to embed to the model below

//////////////
const Product = mongoose.model('Product', productSchema);

function validateProduct(product){
    const schema= Joi.object({
        name: Joi.string().min(3).max(255).required(),
        description: Joi.string().min(1).max(255),
        pp: Joi.number().integer().positive().required(),
        sp: Joi.number().integer().positive().required(),
        upc: Joi.number().integer().positive().required(),
        author: Joi.any(),
        business: Joi.any(),
        inventory: Joi.object(
            {
                au: Joi.number().min(0),
                modifiedDate: Joi.date(),
                place: Joi.string().min(3).max(255),
                worth: Joi.number().min(0)
            }
        ),
    });
    return schema.validate(product);
}               

exports.Product=Product;
exports.validate=validateProduct;