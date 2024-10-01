import mongoose  from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        index:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        index:true,
        trim:true
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,'password is required']
    },
    refrechToken:{
        type:String
    }
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password)
}


userSchema.methods.createAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        userName:this.userName,
        fullName:this.fullName
    },process.env.ACCESS_TOKEN_SECRET,
   {
        expiresIn: ACCESS_TOKEN_EXPIRE
   })
}

userSchema.methods.createRefrechToken = function(){
    return jwt.sign({
        _id:this._id
    },process.env.REFRESH_TOKEN_SECRET,
   {
        expiresIn:REFRESH_TOKEN_EXPIRE
   })
}

export const User = mongoose.model("User",userSchema)