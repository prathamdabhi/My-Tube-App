import { Router } from "express";
import { reagisterUser } from "../controllers/user.controller.js";

const router = Router();

router.route('/register').post(reagisterUser)

export default router