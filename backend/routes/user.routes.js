import express from "express"
import { signUpUser,loginUser, logout, getUser, registerUser, verifyUser, googleLogin } from "../controllers/user.controller.js"
import { isAuthenticated } from "../middleware/user.authentication.middleware.js"

const router = express.Router()

router.route("/googleLogin").post(googleLogin)
router.route('/registerUser').post(registerUser)
router.route('/verifyUser/:token').post(verifyUser)
router.route('/signUpUser').post(signUpUser)
router.route('/loginUser').post(loginUser)
router.route('/logoutUser').post(logout)
router.route('/getUser').post(isAuthenticated,getUser)

export default router