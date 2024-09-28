import { DB_NAME } from "../constents.js";
import dotenv from "dotenv";
import expres from 'express'
import mongoose from "mongoose";
dotenv.config({
    path: "./.env"
});

const dbName = DB_NAME
const dbUrl = process.env.MONGODB_URL


async function dbConnection() {
    try {
       const connectionInstance =  await mongoose.connect(`${dbUrl}/${dbName}`)
       console.log(`My Database Name : ${connectionInstance.connection.name}`)
       console.log(`MongoDB Connected !! DB Host : ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("MongoDB Connection is Faild:",error)
        process.exit(1)
    }
}

export default dbConnection