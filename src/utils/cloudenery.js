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
   const response  = await cloudinary.uploader.upload(localFilePath,{
    resource_type:"auto"
})
        //check if file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response 
   } catch (error) {
    fs.unlinkSync(localFilePath)
    console.log(error)
   }
}

export  {uploadFile}