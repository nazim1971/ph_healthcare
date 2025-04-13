import { NextFunction, Request, RequestHandler, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../shared/pick";
import { adminFilterAbleFields } from "./admin.constant";
import { sendResponse } from "../../shared/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";


const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
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
});

const getByIdFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await AdminService.getByIdFromDB(id);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Admin is not found",
        data: result,
      });
    }
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin reteved Successfully",
      data: result,
    });
  }
);

const updateIntoDb = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await AdminService.updateIntoDB(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin updated Successfully",
      data: result,
    });
  }
);

const deletedFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await AdminService.deleteFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin Data deleted Successfully",
      data: result,
    });
  }
);

const softDeletedFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await AdminService.softDeleteFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin Data deleted Successfully",
      data: result,
    });
  }
);

export const AdminController = {
  getAllAdmin,
  getByIdFromDB,
  updateIntoDb,
  deletedFromDB,
  softDeletedFromDB,
};
