

module.exports= function (req, res, next){
    const employee=req.user.isEmployee;
    const admin=req.user.isAdmin;
    if(!(employee || admin)) return res.status(403).send('Access denied! Only admins can access.');

    next();
}