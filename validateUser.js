     var {dbUser} = require("./db") 
	  var express = require("express") 
	  var router = express.Router() 
	  const Mongoose = require("mongoose");


// connection Check	  
	  function conCheck(){
		  if (Mongoose.connection.readyState=== 2){
			  return 2
		  }
		else  if (Mongoose.connection.readyState === 1){
			return 1
		}
				else  if (Mongoose.connection.readyState === 0){
			return 0
		}
		else  if (Mongoose.connection.readyState === 3){
			return 3
		}
	  }
	  
	  //connectDbsignup for appending db name to mongodb  link during signin
	  
	 function connectDbSignUp(dbname){ 
	 //destroy any former connections if it exists 
	if (conCheck() === 1){
			Mongoose.disconnect()
		}

//dburl  
	var url = `mongodb+srv://Fawazdb:faWIzEDB12@cluster0.ftdwete.mongodb.net/${dbname}?retryWrites=true&w=majority`
  
 
 
 if (conCheck() ===0){
	 return { boo :true , uri : url}
 }
 else {
	 return { boo :false , uri : url}
	 }
	}
	
	//connectDbLogin
	
	function connectDbLogin(dbname){
		
var url = `mongodb+srv://Fawazdb:faWIzEDB12@cluster0.ftdwete.mongodb.net/${dbname}?retryWrites=true&w=majority`
	if (conCheck() === 1){
	 return { boo :true , uri : url}
 }
 else {
	 return { boo :false , uri : url}
	 }

	}
	
	
	router.post("/login", (req,res)=>{
    console.log("login")
             var {uri} =  connectDbLogin(req.body.name) 
	new Promise ( async(resolve,reject)=>{
			 if(uri){
				 resolve (uri) 
			}
			 else{
			 var error = "err"
			 reject(error)
			 
			 }
	}).catch((error)=>error)
	.then(async()=> {
		if(conCheck() !== 1){
			await Mongoose.connect(uri)
			}
	else{
		Mongoose.disconnect()
		await Mongoose.connect(uri)
	}
	}).catch((error)=> error)
	
	.then( async()=> await dbUser.findOne({name:req.body.name})
	).catch((error)=> error)
	
	.then(async(user)=>{
	 if (user === "err"){
	res.end("err" + err) 
			   
}
	 
		else if (user ===  null){
		res.render("login",{ error : "user doesn't exist"})
		
			 
		
		}
			else if( user !== null){  
			
		
		if (!(req.body.Pword)){
			 
		res.render("login",{ error : "input password"})
		}
		else if(user.validPass(req.body.Pword)){
			res.cookie ("name" ,user.name)
			console.log(req.cookies)
		    res.status(200).redirect(`/user/${user.name}/messages`)		
	    
		} 
	    else{ 
		res.render("login",{ error : "wrong password"})		} 
			}		
		
		
		
	})
	  
	 });
	 
	 
	 router.post("/signup",(req,res)=>{
		 
		 // assigning newUser obj to req.body
		 
		 let newUser =  new dbUser();
		 newUser.name = req.body.name;
		 newUser.Lname = req.body.Lname;
		 newUser.Pword = req.body.Pword;
		 
		 // hash password
		 
		 newUser.hashPass(newUser.Pword)
		 
		 // getting db link and connection boolean
		 
			 var {uri,boo} =   connectDbSignUp(newUser.name)
		 new Promise( async(resolve,reject)=>{
			 
			 // resolve if the uri and boolean is available 
			 
			 if (uri && boo)  {
				 resolve(uri);
			 
		 
		 }		 
		 else{
			 // error
			 
		 var error = new Error("couldnt connect")
		 
		 reject(error);
		 
		 }
		  //check if connection is established
		  
		 }).then(conCheck).catch((error)=>error)
		 
		 // disconnections  and reconnections based on the returned values 
		 
		 .then(async (value)=>{ 
		 
		 if (value === 0){
			 
			 await Mongoose.connect(uri)
			 }
			 else if (value === 1) { 
				 Mongoose.disconnect();
				 await Mongoose.connect(uri)
		 }
		 }
			 )
			 //checking connection state and checking if the user exists
			 
			 .then(async()=>{if(conCheck() === 1){ 
			 
		 return await newUser.collection.findOne({name:newUser.name})}
		 
		 else{return "oops"}})
		 
			//catch error       
			
		 .catch((error)=>error).then((user)=>{
			 
			
			// err conditions 
			if(user === "err"){
				res.end("err" + user)
				} 
			// save user if user doesnt exist
			else if (user === null){
				
				res.render("login",{
					error: "",
					mssg:"successfully registered login"
					}) 
				newUser.save();
				

			} 
			
			// error when this condition is met
			else{ 
				res.render("signup",{
				error : "user exists choose another username",
				mssg : ""
			})
			 
			}
			
		}).then(()=> Mongoose.disconnect())
			 
		})
	
	 router.get("/signup",(req,res)=>{
            
if (conCheck() === 1){
			Mongoose.disconnect()
		}
		 res.render("signup",{error:"",
		 mssg:""})
	 })
	 
	 router.get("/login",(req,res)=>{
            
if (conCheck() === 1){
			Mongoose.disconnect()
		}
		 res.render("login",{error:"",
		 mssg:""})
	 })
	 
	
	 module.exports = {router,dbUser,connectDbLogin,conCheck}