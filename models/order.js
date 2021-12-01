const mongoose=require('mongoose');
const Joi=require('joi');



const productDetailsSchema=mongoose.Schema({
    name:{
        type:String,
    },
    stuff:{
        type:String,
    },
    color:{
        type:String,
    },
    summary:{
        type:String,
    }
});
const orderSchema=mongoose.Schema({
    trackingNo:{
        type:String,
        required:true,
    },
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    tailor:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Tailor',
        required:true
    },
    productType:{
        type:String,
        required:true,
    },
    productId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Product'
    },
    productDetails:{
        type:productDetailsSchema,
    },
    coments:{
        type:[{
            type:String,
        }],
    },
    putDate:{
        type:Date,
        default:Date.now(),
    },
    deliveryDate:{
        type:String,
        required:true,
    },
    status:{
        type:String,
    },
    qty:{
        type:Number,
        required:true,
        default:1,
    },
    totalAmount:{
        type:Number,
        required:true,
    }
})

const Order=mongoose.model('Order', orderSchema);

function validateOrder(order){
    const schema=Joi.object({
        trackingNo:Joi.string().required(),
        productDetails:Joi.object({
            name:Joi.string(),
            stuff:Joi.string(),
            color:Joi.string(),
            summary:Joi.string(),
        }),
        customer:Joi.any().required(),
        tailor:Joi.any().required(),
        productType:Joi.string().required(),
        productId:Joi.any().required(),
        coments:Joi.object({
            putDate:Joi.string(),
        }),
        deliveryDate:Joi.date().required(),
        status:Joi.string().required(),
        qty:Joi.number().min(1).required(),
        totalAmount:Joi.number().min(0).required(),
    });

    return schema.validate(order);
}

exports.Order=Order;
exports.validate=validateOrder;