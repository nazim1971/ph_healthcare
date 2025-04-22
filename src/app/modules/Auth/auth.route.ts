import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../../middlewires/auth";


const router  = Router();

router.post('/login',authController.loginUser)
router.post('/refreshToken',authController.refreshToken)
router.put('/change-password',auth("ADMIN", "SUPER_ADMIN","PATIENT","DOCTOR"),authController.changePassword)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

export const AuthRouter = router