var  {dbUser, mesgDB} = require("./db") 
var mongoose = require ("mongoose")
var express = require ("express")
var router2 = express.Router();
var {connectDbLogin,conCheck} = require("./validateUser")
console.log(connectDbLogin)
	
	var unikCukieId=()=>{
		let letters = ["a","b","c","d","e","f"]
	
		var cookieid = ""
		
		for (let i = 0;i<letters.length;i++){
			cookieid+=String(Math.round(Math.random()*letters.length))+letters[Math.round(Math.random()*letters.length)]
		}
		return cookieid
	}

router2.get("/:name/message",(req,res)=>{
	         var name = req.params.name
	var uri =`mongodb+srv://Fawazdb:faWIzEDB12@cluster0.ftdwete.mongodb.net/${name}?retryWrites=true&w=majority`
	mongoose.connect(uri)
		dbUser.findOne({name:name},(err,user)=>{
			if(user === null){
				res.render( "message",{
					error:"",
					name:name
					
				})
			}
	else if(user !== null){	
	res.render("message", {
		error:"",
		lnk:  `/user/${name}/message`,
		name:name
	})
	} 
		})
	})
	router2.post("/:name/message",async (req,res)=>{
		if(conCheck()===1){
			await mongoose.disconnect("disconnect")
		}
    var name = req.params.name
	var uri =`mongodb+srv://Fawazdb:faWIzEDB12@cluster0.ftdwete.mongodb.net/${name}?retryWrites=true&w=majority`
	await mongoose.connect(uri)
	var msg =  new mesgDB
	console.log(msg)
		dbUser.findOne({name:name},(err,user)=>{
			if(user){
				var cukie = unikCukieId();
				res.cookie("id",cukie);
				msg.messageId = cukie;

				msg.message = req.body.message;
				
				msg.save(console.log("saved"))
				res.render("signup",{
					error:"",
					mssg:"your message has been sent successfully. Thank you for participating, now its your turn!!! Signup to get anonymous message from your friends"
				})
				mongoose.disconnect()
					
		}
			else{res.send(err)}
		
		})
				})
			router2.get("/:name/messages",async (req,res)=>{
						if(conCheck()===1){
			mongoose.disconnect("disconnect")
		}
				var Pname = req.params.name 
	var {uri} = connectDbLogin(Pname)		
				console.log(req.cookies.name,uri)
				await	mongoose.connect(uri, async()=>{
			var Tmsg =	await mesgDB.find()
			  console.log([...Tmsg])
						if(Pname === req.cookies.name){
	
			var ip =	req.connection.localAddress.split("f:")[1]
			var port = req.connection.localPort
					res.render("dashboard",{ 
					Uname:Pname,
					mssg:[...Tmsg],
					mssglink : `http://${ip}:${port}/user/${Pname}/message`,
					viewLink: `http://${ip}:${port}/user/${Pname}/messages`
					
					})
					} 
				
				else{
					res.cookie("id",cookieid())
					res.render("messagedb",
					{
						mssg:[...Tmsg],
						Uname:Pname
				}
						)};
					});
				
			})
	
	module.exports = router2
	