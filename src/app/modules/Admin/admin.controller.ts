import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../shared/pick";
import { adminFilterAbleFields } from "./admin.constant";



const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterAbleFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy','sortOrder' ]);
    console.log("Options", options);
    const result = await AdminService.getAllAdmin(filters, options);
    res.status(200).json({
      success: true,
      message: "Admin reteved Successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
      error: error,
    });
  }
};

const getByIdFromDB = async(req: Request, res: Response) =>{
  const {id} = req.params;
  try {
    const result = await AdminService.getByIdFromDB(id);
    res.status(200).json({
      success: true,
      message: "Admin reteved Successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
      error: error,
    });
  }
}

const updateIntoDb = async(req: Request, res: Response)=>{
  const {id} = req.params;
  try {
    const result = await AdminService.updateIntoDB(id, req.body);
    res.status(200).json({
      success: true,
      message: "Admin reteved Successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
      error: error,
    });
  }
}

const deletedFromDB = async(req: Request, res: Response)=>{
  const {id} = req.params;
  try {
    const result = await AdminService.deleteFromDB(id);
    res.status(200).json({
      success: true,
      message: "Admin Data deleted Successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
      error: error,
    });
  }
}

export const AdminController = {
  getAllAdmin,
  getByIdFromDB,
  updateIntoDb,
  deletedFromDB
};
