const Express=require('express');
const router=Express.Router();
const _=require('lodash');
const mongoose=require('mongoose');
const Joi=require('joi');


const {Order, validate}=require('../models/order');
const {User}=require('../models/user');
const authorization=require('../middleware/authorization');
const isCustomer=require('../middleware/isCutomer');
const isTailor=require('../middleware/isTailor');
const isAdmin=require('../middleware/isAdmin');
const sendEmail=require('../services/mailer');

router.post('/', authorization, isCustomer,  async (req, res) =>{
    // if validation error
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // if customer and tailor validation error
    const isValidCustomer=mongoose.Types.ObjectId.isValid(req.body.customer);
    let user=await User.findOne({_id:req.body.customer});
    if(!isValidCustomer || user.type!=='customer' /*if user type is not customer*/) return res.status(400).send('Invalid Customer!');
    const isValidTailor=mongoose.Types.ObjectId.isValid(req.body.tailor);
    user=await User.findOne({_id:req.body.tailor});
    if(!isValidTailor || user.type!=='tailor' /*if user type is not tailor */ ) return res.status(400).send('Invalid Tailor!');
    // else if everything is good
    // picking up the relatabe data to save in database     
    let order;
    if(req.body.productType==='custom')// if productType is custom
    {
        order=new Order(_.pick(req.body, ['trackingNo', 'productDetails', 'customer', 'tailor','productType',
        'comments', 'deliveryDate', 'qty', 'totalAmount']));
    }
    else
    {
        order=new Order(_.pick(req.body, ['trackingNo', 'customer', 'tailor','productType',
        'productId', 'comments', 'deliveryDate', 'qty', 'totalAmount']));
    }
    order.status='pending for approval';// by default for tailor to approve
    await order.save();
    //await sendEmail('talhatanveer333@gmail.com', 'Smart Tailor Order Confirmation', 'This is easy.');
    // sending back the newly created instance
    res.send(order);
});


router.patch('/approve/:id', authorization, isTailor, async(req, res)=>{
    const orderId=req.params.id;
    if(!mongoose.Types.ObjectId.isValid(orderId)) return res.status(400).send('Invalid order id.');

    const order=await Order.findOne({_id:orderId/*, tailor:req.user._id*/});//uncomment this
    if(!order) return res.status(400).send('Order not found.');

    // else if everything is good
    order.status="Progress";
    await order.save();
    // sending email

    // sending response
    res.send(order);
    
});

router.get('/', authorization, async(req, res)=>{
    const orders=await Order.find().or([{customer:req.user._id}, {tailor:req.user._id}]);
    if(!orders) return res.status(404).send('No order(s) found.');

    return res.send(orders);
});

router.get('/query', authorization, isAdmin, async(req, res)=>{
    let orders;
    const customerId=req.query.customerId;
    const tailorId=req.query.tailorId;
    const orderId=req.query.orderId;

    if(orderId){
        orders=await Order.find({_id:orderId});
        if(!orders) return res.status(404).send('No order(s) found.');
    }
    else if(customerId && tailorId){
        orders=await Order.find().or([{customer:customerId}, {tailor:tailorId}]);
        if(!orders) return res.status(404).send('No order(s) found.');
    }
    else if(customerId){
        orders=await Order.find({customer:customerId});
        if(!orders) return res.status(404).send('No order(s) found.');
    }
    else if(tailorId){
        orders=await Order.find({tailor:tailorId});
        if(!orders) return res.status(404).send('No order(s) found.');
    }
    else{
        orders=await Order.find().limit(15);
        if(!orders) return res.status(404).send('No order(s) found.');
    }

    return res.send(orders);
});

module.exports=router;