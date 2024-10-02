import { Router } from "express";
import { login, logout, reagisterUser,refreshaccesstoken } from "../controllers/user.controller.js";
import {upload} from '../middlewares/multyer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middlware.js";

const router = Router();
//REGISTER
router.route('/register').post(
    upload.fields([{
        name:"avatar",
        maxCount:1
    },{
        name:"coverImage",
        maxCount:1
    }]),
    reagisterUser)

//LOGIN
router.route('/login').get(login)

//LOGOUT
router.route('/logout').get(verifyJWT,logout)
export default router

//REFRESH ACCESS TOKEN
router.route('/refresh-token').get(refreshaccesstoken)