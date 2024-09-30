import dbConnection from "./db/db.js";
import app from "./app.js";
import dotenv from 'dotenv'
dotenv.config({
   path: "./.env"
})
const port = process.env.PORT || 8000

dbConnection()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERROR:",error)
        throw error
    })
    app.listen(port,()=>{
        console.log("server is running at port:",port);
    })
   
})
