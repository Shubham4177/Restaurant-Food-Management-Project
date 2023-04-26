var express = require('express');
var pool=require('./pool')
var upload=require('./multer')
var router = express.Router();
var LocalStorage=require('node-localstorage').LocalStorage;
localStorage=new LocalStorage('./scratch');




/* GET use to show food interface */
router.get('/foodinterface', function(req, res, next) {
  try{
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    if(admin)
  res.render('foodinterface',{status:false,message:''})
  else
  {
    res.render('logininterface',{message:''})
  }
}
catch(e)
{
  res.render('logininterface',{message:''})
}
});
 
// use to fetch all food cuisines
router.get('/fetchallfoodcuisine',function(req,res){
 pool.query("select * from foodcuisine",function(error,result){
  if(error)
  { res.status(500).json([])}
  else
  {res.status(200).json(result)}
 })
})

/* use to fetch all food items*/
router.get('/fetchallfooditems',function(req,res){
  pool.query("select * from fooditems where foodid=?",[req.query.foodid],function(error,result){
   if(error)
   { res.status(500).json([])}
   else
   {res.status(200).json(result)}
  })
 })


 router.post('/submit_food_details',upload.single('poster'),function(req,res){
  var addi=(""+req.body.additional).replaceAll("'",'"')

  console.log("BODY:",req.body)
  console.log("FILE:",req.file)

  pool.query("insert into fooddetails ( foodid, fooditemid, statustype, status, description, price, offer, additional, poster)values(?,?,?,?,?,?,?,?,?)",[req.body.foodid,req.body.fooditemid,req.body.statustype,req.body.status,req.body.description,req.body.price,req.body.offer,addi,req.file.originalname],function(error,result){
    if(error)
    {
      res.render('foodinterface',{status:false,message:'Server Error...'})
    }
    else{
  
      res.render('foodinterface',{status:true,message:'Record Submitted Successfully... '})
    }
  })
 })

 router.get('/fetchallfood',function(req,res){
  var admin=JSON.parse(localStorage.getItem('ADMIN'))
  if(!admin)
  res.render('logininterface',{message:''})
  else
  pool.query("select FD.*,(select FC.foodcuisinename from foodcuisine FC where FC.foodid=FD.foodid) as foodcuisinename , (select FI.fooditemname from fooditems FI where FI.fooditemid=FD.fooditemid) as fooditem from fooddetails FD",function(error,result){
   if(error)
   { res.render('displayallfood',{data:[]})}
   else
   { res.render('displayallfood',{data:result})}
  })
 })


 router.get('/edit_food_data',function(req,res){
  pool.query("select FD.*,(select FC.foodcuisinename from foodcuisine FC where FC.foodid=FD.foodid) as foodcuisinename , (select FI.fooditemname from fooditems FI where FI.fooditemid=FD.fooditemid) as fooditem from fooddetails FD where FD.fdid=?",[req.query.fdid],function(error,result){
    if(error)
    {
      res.render('displaybyid',{data:[]})
    }
    else{
      console.log(result)
      res.render('displaybyid',{data:result[0]})
    }
  })
})


router.post('/edit_food_details',function(req,res){
  if(req.body.btn=="Edit")
  {
    pool.query("update  fooddetails set foodid=?, fooditemid=?, statustype=?, status=?, description=?, price=?, offer=?,additional=? where fdid=?",[req.body.foodid,req.body.fooditemid,req.body.statustype,req.body.status,req.body.description,req.body.price,req.body.offer,req.body.additional,req.body.fdid],function(error,result){
  
      if(error)
      {console.log(error)
        res.redirect('/food/fetchallfood')
      }
      else
      {
      
        res.redirect('/food/fetchallfood')
      }
    })
  }
  else
  {
    pool.query("delete from fooddetails where fdid=?",[req.body.fdid],function(error,result){
  
      if(error)
      {console.log(error)
        res.redirect('/food/fetchallfood')
      }
      else
      {
      
        res.redirect('/food/fetchallfood')
      }
    })
  }
  })

  router.get('/displayposter', function(req, res, next) {
    res.render('displayposter',{data:req.query})
  })




  router.post('/edit_poster',upload.single('poster'),function(req,res){


    pool.query("update  fooddetails set poster=? where fdid=?",[req.file.originalname,req.body.fdid],function(error,result){
  
      if(error)
      {
        res.redirect('fetchallfood')
      }
      else
      {
        res.redirect('fetchallfood')
      }
    })
  })
  
  




module.exports = router;
