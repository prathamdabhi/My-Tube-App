import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/user.model.js'
import  {uploadFile}  from "../utils/cloudenery.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//REGISTER USER
const reagisterUser = asyncHandler(async (req,res)=>{
    //get user details from frontend
    //validation - empty fields
    //check if user already exist:username and email
    //check for coverImage and avatar
    //upload them in cloudenary
    //create user object entry in db
    //remove password and refresh token filed from response
    //check for user creation
    //return res

    // res.status(200).json({
    //     message:"user Register Sucessfully"
    // })

  const {userName,email,fullName,password} = req.body
  console.log("email",email)

 if(
    [userName,email,fullName,password].some((filed)=> filed?.trim() === "")
 ){
    throw new ApiError(400,"All fields are required");
 }
 const findUser= await User.findOne({
    $or:[{userName},{email}]
 })
 if(findUser){
    throw new ApiError(409,"User already exist")
 }

 const avatarLocalPath = req.files?.avatar[0]?.path
 const coverImagelocalPath = req.files?.coverImage[0]?.path

 if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required");
 }
 const avatar = await uploadFile(avatarLocalPath)
 const coverImage = await uploadFile(coverImagelocalPath)

 if(!avatar){
    throw new ApiError(400,"Avatar file is required");
 }
 
    const user = await User.create({
        userName,
        email,
        fullName,
        avatar:avatar.url,
        coverImage:coverImage.url,
        password
    })

    const creatingUser = await User.findById(user._id).select("-password -refrechToken")

    if(!creatingUser){
        throw new ApiError(500,"Something went wrong while registering the user" )
    }

    return res.status(201).json(
        new ApiResponse(201,creatingUser,"User Register Sucessfully")
    )
})

//LOGIN USER
const login = asyncHandler(async(req,res)=>{
   // get user details from req.body
   // check userName and email
   //find the user
   //check for password
   //access token and refrsh token

   
})



export {reagisterUser,login}