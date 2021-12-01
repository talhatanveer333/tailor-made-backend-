const Express=require('express');
const router=Express.Router();
const _=require('lodash');
const mongoose=require('mongoose');
const Joi=require('joi');


const {Order, validate}=require('../models/order');
const {User}=require('../models/user');
const authorization=require('../middleware/authorization');
const isCustomer=require('../middleware/isCutomer');

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
    order.save();
    // sending back the newly created instance
    res.send(order);
});

module.exports=router;