import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

  // Configuration
  cloudinary.config({ 
    cloud_name: process.env.CLOUDENERY_NAME, 
    api_key: process.env.CLOUDENERY_APIKEY, 
    api_secret: process.env.CLOUDENERY_SECRET
});

const uploadFile = async (localFilePath)=>{
   try {
    if(!localFilePath) return "FilePath Is Not Prasent"
   const fileuploadUrl = await cloudinary.uploader.upload(localFilePath,{
    resource_type:"auto"
})
   } catch (error) {
    fs.unlinkSync(localFilePath)
    console.log(error)
   }
}

export  {uploadFile}