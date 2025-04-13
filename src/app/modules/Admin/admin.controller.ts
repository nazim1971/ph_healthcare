import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../shared/pick";
import { adminFilterAbleFields } from "./admin.constant";
import { sendResponse } from "../../shared/sendResponse";
import httpStatus from "http-status";

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterAbleFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    console.log("Options", options);
    const result = await AdminService.getAllAdmin(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
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

const getByIdFromDB = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const result = await AdminService.getByIdFromDB(id);
    if(!result){
     return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Admin is not found",
        data: result
      });
    }
   return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin reteved Successfully",
      data: result,
    });
  } catch (error) {
   next(error)
  }
};

const updateIntoDb = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const result = await AdminService.updateIntoDB(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin updated Successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deletedFromDB = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const result = await AdminService.deleteFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin Data deleted Successfully",
      data: result,
    });
  } catch (error) {
   next(error)
  }
};

const softDeletedFromDB = async (req: Request, res: Response,next: NextFunction) => {
  const { id } = req.params;
  try {
    const result = await AdminService.softDeleteFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin Data deleted Successfully",
      data: result,
    });
  } catch (error) {
    next(error)
  }
};

export const AdminController = {
  getAllAdmin,
  getByIdFromDB,
  updateIntoDb,
  deletedFromDB,
  softDeletedFromDB,
};
