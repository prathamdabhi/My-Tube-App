import { Router } from "express"
import {
  changeCurrentPassword,
  getUser,
  getUserChannelProfile,
  getWatchHistory,
  login,
  logout,
  reagisterUser,
  refreshaccesstoken,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multyer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middlware.js"

const router = Router()
//REGISTER
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  reagisterUser
)

//LOGIN
router.route("/login").get(login)

//LOGOUT
router.route("/logout").get(verifyJWT, logout)
export default router

//REFRESH ACCESS TOKEN
router.route("/refresh-token").get(refreshaccesstoken)
//CHANGEPASSWORD
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
//GETCURRENT USER
router.route("/get-user").get(verifyJWT, getUser)
//UPDATE ACCOUNT DETAIL
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
//UPDATE USER COVERIMAGE
router
  .route("/update-coverimage")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
//GET USER CHANNEL PROFILE
router.route("/channels/:userName").get(verifyJWT, getUserChannelProfile)
//GET WATCH HISTORY
router.route("/watch-history").get(verifyJWT, getWatchHistory)
