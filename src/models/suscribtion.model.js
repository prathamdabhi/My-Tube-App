import mongoose, { Types } from "mongoose";

const subsciptionSchema = new mongoose.Schema({
    suscriber:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})

export const Subscription = mongoose.model("Subscription",subsciptionSchema)