const mongoose = require("mongoose");
const crypto = require ("crypto")

var userSchem = new mongoose.Schema({
	
	name : {type:String,required:true},
	salt : String,  
	hash : String 
	
	
	
})

var messageSchem = new mongoose.Schema({
	messageId :{type:String},
	message:{type:String,required:true}
	reaction :{
		funny:Number,
		sad : Number,
		boring:Number,
		wow:Number,
		crazy: Number,
		String(false): Number
	}
		})


 userSchem.methods.hashPass = function(password){
 this.salt = crypto.randomBytes(16).toString(`hex`)
 this.hash  = crypto.pbkdf2Sync(password,this.salt,100,64, `sha512`).toString(`hex`);
	 };
	 
userSchem.methods.validPass = function(password){
	var hash  = crypto.pbkdf2Sync(password,this.salt,100,64, `sha512`).toString(`hex`);
	 
	 if (this.hash=== hash){ return true } else{ return false }
	 

}

const user = module.exports ={ dbUser:mongoose.model("userInfo", userSchem) ,mesgDB : mongoose.model("msg",messageSchem)}
