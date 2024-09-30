import { Router } from "express";
import { reagisterUser } from "../controllers/user.controller.js";
import {upload} from '../middlewares/multyer.middleware.js'

const router = Router();

router.route('/register').post(
    upload.fields({
        name:"avatar",
        maxCount:1
    },{
        name:"coverImage",
        maxCount:1
    }),
    reagisterUser)

export default router