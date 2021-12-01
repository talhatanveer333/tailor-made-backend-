const Express=require('express');
const router=Express.Router();
const _=require('lodash');
const mongoose=require('mongoose');


const {Order, validate}=require('../models/order');
const authorization=require('../middleware/authorization');
const isAdmin=require('../middleware/isAdmin');

router.post('/', authorization, async (req, res) =>{
    // if validation error
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // if customer or tailor validation error
    const isValidCustomer=mongoose.Types.ObjectId.isValid(req.body.customer);
    if(!isValidCustomer) return res.status(400).send('Invalid Customer!');
    const isValidTailor=mongoose.Types.ObjectId.isValid(req.body.tailor);
    if(!isValidTailor) return res.status(400).send('Invalid Tailor!');
    // else if everything is good
    // picking the relatabe data to save in databse
    const order=new Order(_.pick(req.body, ['trackingNo', 'productDetails', 'customer', 'tailor','productType',
    'productId', 'comments', 'deliveryDate', 'status', 'qty', 'totalAmount']));
    order.save();
    // sending back the newly created instance
    res.send(order);
});

module.exports=router;