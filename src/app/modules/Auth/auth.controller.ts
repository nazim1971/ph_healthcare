import httpStatus  from 'http-status';
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authServices } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";



const loginUser = catchAsync(async (req: Request, res: Response) =>{
    const result = await authServices.loginUser(req.body)
    const {refreshToken,accessToken,needPasswordChange} = result;
    res.cookie('refreshToken', refreshToken,{
        secure: false,
        httpOnly: true
    })
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Successfully login",
        data: {
            accessToken,
            needPasswordChange
        }

    })
})

const refreshToken = catchAsync(async (req: Request, res: Response) =>{
    const {refreshToken} = req.cookies;
    const result = await authServices.refreshToken(refreshToken)
  
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Successfully login",
        data: result
        // data: {
        //     accessToken,
        //     needPasswordChange
        // }

    })
})

export const authController = {
    loginUser,
    refreshToken
}