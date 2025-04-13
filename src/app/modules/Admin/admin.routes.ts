import { NextFunction, Request, Response, Router } from "express";
import { AdminController } from "./admin.controller";
import validateRequest from "../../../middlewires/validateRequest";
import { AdminValidation } from "./admin.Validation";

const router = Router();

router.get("/", AdminController.getAllAdmin);
router.get("/:id", AdminController.getByIdFromDB);
router.patch("/:id", validateRequest(AdminValidation.updateAdmin), AdminController.updateIntoDb);
router.delete("/:id", AdminController.deletedFromDB);
router.patch("/soft/:id", AdminController.softDeletedFromDB);

export const AdminRoutes = router;
