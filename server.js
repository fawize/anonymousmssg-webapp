const express = require('express'); 
const app = express();
var path = require('path');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var router2 = require("./messageRoute");
var {router,dbUser} = require('./validateUser'); 
delete require.cache[require.resolve("./validateUser")];
var {router , dbUser} = require('./validateUser'); 
var cookieP = require ("cookie-parser" )
 
app.set('view engine','ejs');
app.use(cookieP())
app.use(bodyParser.urlencoded({extended:false})); 
app.use("/user",router)
app.use("/user",router2)
	app.get('/',(req,res)=>{
		 
			if(typeof req.query=== "object"){
				
				res.render('login',{
				
				error: false
			})}
	});
				
app.listen(6090);