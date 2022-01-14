const Express=require('express');
const router=Express.Router();
const _=require('lodash');
const mongoose = require('mongoose');

const {Product, validate}=require('../models/product');
const authorization=require('../middleware/authorization');
const isCustomer=require('../middleware/isCutomer');

router.post('/', authorization, async (req, res) =>{
    ////////////// adding ////////////////////
    const {error}=validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    req.body.author=req.user._id;

    let product=await Product.findOne({author:req.user._id, name:req.body.name});
    if(product) return res.status(400).send('Product already exist!');

    //else if everything is good
    //choose what to save in database
    product=new Product(_.pick(req.body, ['name', 'description', 'price', 'imageUrl', 'packages']));
    product.author=req.user._id;// setting the author    
    // saving to the database
    await product.save();

    res.send(_.pick(product, ['_id', 'name', 'description', 'price', 'imageUrl', 'author', 'packages']));
});

//////////////getting//////////////////
router.get('/', authorization, async (req, res) =>{
    let products=await Product.find({author:req.user._id});
    if (!products) return res.status(404).send('Not found.');
    
    res.send(products);
});
router.get('/id/:id', authorization, async (req, res) =>{
    let id=req.params.id;
    if(id && mongoose.Types.ObjectId.isValid(id)){
        let product=await Product.findOne({author:req.user._id, _id:id});
        if (!product) return res.status(404).send('Not found.');
        res.send(product);
    } else{
        res.status(400).send('Product id is required.');
    }
});
router.get('/tailor/:tailorId', authorization, async (req, res) =>{
    let tailorId=req.params.tailorId;
    if(tailorId && mongoose.Types.ObjectId.isValid(tailorId)){
        let product=await Product.find({author:tailorId});
        if (!product) return res.status(404).send('No product found.');
        res.send(product);
    } else{
        res.status(400).send('TailorId is required.');
    }
});
//////////////editing///////////////////
// inventory update
// router.patch('/:name/:cartons/:units', authorization, async (req, res) =>{
//     try{
//         let product=await Product.findOne({author:req.user._id, business:req.user.selectedBusiness, name:req.params.name});
//         if (!product) return res.status(404).send('Bad request!');
//         //else
//         const addingCartons=parseInt(req.params.cartons);
//         const addingUnits=parseInt(req.params.units);
//         if(addingCartons>=0 && addingUnits>=0)
//         {
//         let totalAddingUnits=(addingCartons*product.upc) + addingUnits;
//         let totalAddingWorth=totalAddingUnits * product.pp;// multiplying with purchase price to calculate worth
        
//         product.inventory.au+=totalAddingUnits;
//         product.inventory.worth+=totalAddingWorth;
//         product.inventory.modifiedDate=Date.now();
//         if(req.query.place) product.inventory.place=req.query.place;

//         await product.save();
//         res.send(product);
//         }
//         else
//         {
//             res.status(400).send('Inventory cannot be removed!');
//         }
//     }
//     catch(err){
//         return res.status(400).send(err.message);
//     }
// });

module.exports=router;