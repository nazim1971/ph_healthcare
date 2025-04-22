import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if(error.code === 'P2025'){
    res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message:  `No ${error?.meta?.modelName} found`,
      error: {
        name: `NotFoundError in ${error.meta.modelName} model`,
        code: error.code,
        clientVersion: error.clientVersion
      },
    });
  }
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message || "Something went wrong",
    error: error,
  });
};
