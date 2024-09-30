import { asyncHandler } from "../utils/asyncHandler.js";

const reagisterUser = asyncHandler(async (req,res)=>{
    res.status(200).json({
        message:"user Register Sucessfully"
    })
})

export {reagisterUser}