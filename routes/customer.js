const Express=require('express');
const router=Express.Router();
const mongoose=require('mongoose');
const _=require('lodash');

const {Customer, validate} =require('../models/customrer');
const authorization = require('../middleware/authorization');
const isAdmin = require('../middleware/isAdmin');


router.post('/', authorization, isAdmin, async (req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);//if provided data invalid

    let customer=await Customer.findOne({author:req.user._id, no:req.body.no});
    if(customer) return res.status(400).send('Customer already exist.');

    const isValidUser=mongoose.Types.ObjectId.isValid(req.body.author);
    if(!isValidUser) return res.status(400).send('Invalid User.');

    //else if everything is good

    //choose what to save in database
    customer = new Customer(_.pick(req.body, ['no', 'name', 'contact', 'area', 'address', 'author', 'business', 'balancesheet' ]));
    await customer.save();

    res.send(_.pick(customer, ['no', 'name', 'contact', 'area', 'address', 'balancesheet']));
});
////////////////////////
router.get('/', authorization, isAdmin, async (req, res)=>{
    let customers=await Customer.findOne({author:req.user._id, business:req.user.selectedBusiness});
    if(!customers) return res.status(404).send('Not found.');

    res.send(customers);
});

////////////////////////
router.patch('/:no/:amount', authorization, isAdmin, async (req, res)=>{
    try{
        const customer=await Customer.findOne({no:req.params.no, business:req.user.selectedBusiness});
        if(!customer) return res.status(400).send('Invalid customer.');

        const amount=parseInt(req.params.amount);
        customer.balancesheet.amount+=amount;
        if(amount!==0)
        {
        customer.balancesheet.updateTime=Date.now();
        await customer.save();
        res.send(_.pick(customer, ['no', 'name', 'contact', 'area', 'address', 'balancesheet']));
        }
        else{
            return res.status(400).send('Amount should not be 0.');    
        }
    }
    catch(err){
        return res.status(400).send('Bad request.');
    }
});



module.exports=router;