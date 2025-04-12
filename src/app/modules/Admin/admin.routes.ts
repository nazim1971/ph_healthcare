import { Router } from "express";
import { AdminController } from "./admin.controller";

const router = Router();

router.get('/', AdminController.getAllAdmin);
router.get('/:id', AdminController.getByIdFromDB);
router.patch('/:id', AdminController.updateIntoDb);
router.delete('/:id', AdminController.deletedFromDB);


export const AdminRoutes=  router;