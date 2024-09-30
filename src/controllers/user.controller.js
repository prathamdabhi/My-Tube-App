import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/user.model.js'
import  {uploadFile}  from "../utils/cloudenery.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

  const {userName,email,fullName,avatar,coverImage,password} = req.body
  console.log("email",email)

 if(
    [userName,email,fullName,avatar,coverImage,password].some((filed)=> filed?.trim() === "")
 ){
    throw new ApiError(400,"All fields are required");
 }
 const findUser= User.findOne({
    $or:[{userName},{email}]
 })
 if(findUser){
    throw new ApiError(409,"User already exist")
 }

 const avatarLocalPath = req.files?.avatar[0]?.path
 const coverImagelocalPath = req.files?.coverImage[0]?.path

 if(avatarLocalPath){
    throw new ApiError(400,"Avatar file is required");
 }
 const avatarUrl = await uploadFile(avatarLocalPath)
 const coverImageUrl = await uploadFile(coverImagelocalPath)

 if(!avatarUrl){
    throw new ApiError(400,"Avatar file is required");
 }
 
    const user = await User.create({
        userName,
        email,
        fullName,
        avatar:avatarUrl,
        coverImage:coverImageUrl,
        password
    })

    const creatingUser = await user.findbyId(user._id).select("-password -refrechToken")

    if(creatingUser){
        throw new ApiError(500,"Something went wrong while registering the user" )
    }

    return res.status(201).json(
        new ApiResponse(201,creatingUser,"User Register Sucessfully")
    )
})



export {reagisterUser}