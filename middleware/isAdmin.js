

module.exports= function (req, res, next){
    const type=req.user.type;
    if(type!=='admin') return res.status(403).send('Access denied! Only admin can access.');

    next();
}