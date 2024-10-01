import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req,_,next)=>{
  try {
     const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ","") 
  
      if(!token){
          throw new ApiError(401,"Unauthorized request:Token not found")
      }
  
     const decordtoken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  
     const user = await User.findById(decordtoken?._id).select("-password -refrechToken")
     if(!user){
      throw new ApiError(401,"Invalid Access Token")
  }
  req.user = user
  next()
  } catch (error) {
    throw new ApiError(400,error.message || "something went wrong while creating token")
  }
})