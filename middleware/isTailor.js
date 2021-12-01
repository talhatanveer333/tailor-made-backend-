module.exports=function (req,res,next)
{
    if(req.user.type!=='tailor' && req.user.type!=='admin')
        return res.status(403).send('Access denied! Only tailors can access.')

    next()
}