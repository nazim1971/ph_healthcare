import { Request, Response } from "express";
import { AdminService } from "./admin.service";

const getAllAdmin = async (req: Request, res: Response) => {
  const result = await AdminService.getAllAdmin(req.query);
  res.status(200).json({
    success: true,
    message: "Admin reteved Successfully",
    data: result,
  });
};

export const AdminController = {
  getAllAdmin,
};
