import  Router, { NextFunction, Request, Response }  from "express";
import { userController } from "./user.controller";
import auth from "../../../middlewires/auth";

const router = Router();


router.post('/',auth("ADMIN") , userController.createAdmin);

export const userRoutes = router;