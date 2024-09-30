import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

const app = express()
dotenv.config({
    path: './.env'
})

app.use(cors({
    origin:process.env.CORSE_ORIGIN,
    credentials: true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())



//routers

import router from './routes/user.routes.js'

//router declaretion
app.use('/api/v1/users',router)



export default app