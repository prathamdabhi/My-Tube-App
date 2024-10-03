import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/user.model.js'
import  {uploadFile}  from "../utils/cloudenery.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'

//GENERATE ACCESS AND REFRESH TOKEN
const generateAccessAnsRefreshToken = async (userid)=>{
  try {
   const user = await User.findById(userid)
   const accessToken = user.createAccessToken()
   const refrechToken = user.createRefrechToken()

   user.refrechToken = refrechToken
   await user.save({validateBeforeSave:false})

   return {accessToken,refrechToken}
  } catch (error) {
   throw new ApiError(500,error.message)
  }
}




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
   //send cookies

   const {userName,email,password} = req.body
   if(!email && !userName){
      throw new ApiError(400,"User or Email is required")
   }
   const user = await User.findOne({
      $or:[{userName},{email}]
   })

   if(!user){
      throw new ApiError(404,"User not found")
   }
   const isPAsswordValid = await user.isPasswordCorrect(password)

   if(!isPAsswordValid){
      throw new ApiError(401,"invalid user credentials")
   }

  const {accessToken,refrechToken} =   await generateAccessAnsRefreshToken(user._id)

  const loggedInUSer = await User.findById(user._id).select("-password -refrechToken")

  const options = {
   httpOnly:true,
   secure:true,
  }

  res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refrechToken",refrechToken,options)
  .json(new ApiResponse(200,{
   user:loggedInUSer,accessToken,refrechToken
  },
"User Loggedin Successfully"))

})

//LOGOUT USER
const logout = asyncHandler(async(req,res)=>{
 await User.findByIdAndUpdate(req.user._id,{
   $set:{
      refrechToken : undefined
   }
 },
{new:true})

const options = {
   httpOnly:true,
   secure:true
}
   res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refrechToken",options)
   .json(
      new ApiResponse(200,{},"User Logout Successfully ")
   )
})

//REFRESH ACCESS TOKEN
const refreshaccesstoken = asyncHandler(async (req,res)=>{
   try {
      const incomingrefreshToken = req.cookies?.refrechToken
      if(!incomingrefreshToken){
         throw new ApiError(401,"unauthorized Access");
      }
      const decodedToken = jwt.verify(incomingrefreshToken,process.env.REFRESH_TOKEN_SECRET)
      const user = await User.findById(decodedToken?._id)
      if(!user){
         throw new ApiError(401,"Invalid refresh token");
      }
   
      if(incomingrefreshToken !== user.refrechToken){
         throw new ApiError(401,"refreshtoken is expired or is used");
      }
      const options = {
         httpOnly:true,
         secure:true
      }
      const {accessToken,refrechToken} =  await generateAccessAnsRefreshToken(user._id)
      res
      .status(200)
      .cookie("accesstoken",accessToken,options)
      .cookie("refreshToken",refrechToken,options)
      .json(
         new ApiResponse(200,{accessToken,refrechToken},"AccessToken refresh")
      )
   } catch (error) {
      throw new ApiError(401,error.message)
   }
   
})

//CHANGE CURRENT PASSWORD
const changeCurrentPassword = asyncHandler(async (req,res)=>{
try {
      const {currentPassword,newPassword} = req.body
      const user = await User.findById(req.user._id)
      const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
      if(!isPasswordCorrect){
         throw new ApiError(400,"Current password is incorrect")
      }
   
      user.password = newPassword
      await user.save({validateBeforeSave:false})
      res
      .status(200)
      .json(
         new ApiResponse(200,{},"Password changed successfully")
      )
} catch (error) {
   throw new ApiError(401,error.message)
}
})

// get User
const getUSer = asyncHandler(async (req,res)=>{
   const user = await User.findById(req.user._id)
   if(!user){
      throw new ApiError(401,"User is not present")
   }
   res
   .status(200)
   .json(
      new ApiResponse(200,{
         user:user
      },
   "User info get successfully")
   )
})
const updateUserAvatar = asyncHandler(async (req,res)=>{
   const avatarLocalPath = req.file?.path
   if(!avatarLocalPath){
      throw new ApiError(401,"avatarLocalPath is not available")
   }
   const avatar = await uploadFile(avatarLocalPath)
   if(!avatar.url){
      throw new ApiError(401,"Error while uploading Avatar")
   }
   const user = await User.findById(req.user?._id,{
      $set:{
         avatar:avatar.url
      }},{new:true}
   ).select("-password")
   res
   .status(200)
   .json(
      new ApiResponse(200,user,"Avatar update successfully")
   )

})
//UPDATE USER COVER IMAGE
const updateUserCoverImage = asyncHandler(async (req,res)=>{
   const coverImageLocalPath = req.file?.path
   if(!coverImageLocalPath){
      throw new ApiError(401,"coverImageLocalPath is not available")
   }
   const coverImage = await uploadFile(coverImageLocalPath)
   if(!coverImage.url){
      throw new ApiError(401,"Error while uploading CoverImage")
   }
   const user = await User.findById(req.user?._id,{
      $set:{
         coverImage:coverImage.url
      }},{new:true}
   ).select("-password")

   res
   .status(200)
   .json(
      new ApiResponse(200,user,"coverImage update successfully")
   )

})

//GET USER CHANNEL PROFILE
const getUserChannelProfile = asyncHandler(async(req,res)=>{
   const {userName} = req.param
   if(!userName){
      throw new ApiError(400,"User Cahnnel is Not Available")
   }
   const channel = await User.aggregate([
     { $match:{
         userName:userName
      }},
      {$lookup:{
         from:"subscriptions",
         localField:"_id",
         foreignField:"channel",
         as:"subscribers"
      }},
      {$lookup:{
         from:"subscriptions",
         localField:"_id",
         foreignField:"suscriber",
         as:"subscribTo"
      }},
      {
         $addFields:{
            subscriberCount:{
               $size:"$subscribers"
            },
            subscribToCount:{
               $size:"$subscribTo"
            },
            isSubscribe:{
               $cond:{
                  if:{$in:[req.user?.id,"$subscribers.suscriber"]},
                  then:true,
                  else:false
               }
            }
         }
      },{
         $project:{
            fullName:1,
            userName:1,
            email:1,
            subscriberCount:1,
            subscribToCount:1,
            avatar:1,
            coverImage:1,
            createdAt:1
         }
      }
   ])
   if(!channel){
      throw new ApiError(404,"Channel Does not Exeicst")
   }
   console.log(channel)
   res
   .status(200)
   .json(
      new ApiResponse(200,channel[0],"User Channel fetch successfully")
   )
   
   
})
  



export {reagisterUser,
   login,
   logout,
   refreshaccesstoken,
   changeCurrentPassword,
   getUSer,
   updateUserAvatar,
   updateUserCoverImage,
   getUserChannelProfile
}