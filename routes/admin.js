var express = require('express');
var router = express.Router();
var pool=require('./pool')
var LocalStorage=require('node-localstorage').LocalStorage;
localStorage=new LocalStorage('./scratch');


router.get('/logout', function(req, res, next) {
    localStorage.clear()
    res.render('logininterface',{message:''})
})



router.get('/logininterface', function(req, res, next) {

    try{
        var admin=JSON.parse(localStorage.getItem('ADMIN'))
        
        if(admin)
        res.render('dashboard',{admin:JSON.parse(admin)})
        else
        {
          res.render('logininterface',{message:''})
        }
        }
        catch(e)
{res.render('logininterface',{message:''})}
  })



  router.post("/chkadmin",function(req,res){
    pool.query("select * from admins where (emailid=? or mobileno=?) and password=?",[req.body.emailid,req.body.emailid,req.body.pwd],function(error,result){

if(error)
{
    res.render('logininterface',{message:'Server Error....'})
}
else
{
    if(result.length==0)
    {
        res.render('logininterface',{message:'Invalid EmailId/Mobile Number/Password'})
    }
    else
    {localStorage.setItem("ADMIN",JSON.stringify(result[0]))
        res.render('dashboard',{admin:result[0]})
    }
}
    })
    
})



  module.exports = router;