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
        message: "Access Token generated Successfully login",
        data: result
    })
})

const changePassword = catchAsync(async (req: Request, res: Response) =>{
    const user = req.user
    console.log("req",req?.user);
    const result = await authServices.changePassword(user, req.body)
  
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password changed Successfully ",
        data: result

    })
})


const forgotPassword = catchAsync(async (req: Request, res: Response) =>{
    const user = req.user
    console.log("req",req?.user);
    const result = await authServices.forgotPassword(req.body)
  
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Check your email!"
    })
})

const resetPassword = catchAsync(async (req: Request, res: Response) =>{
    const token = req.headers.authorization || "";
    console.log("req.body",req.body);
    const result = await authServices.resetPassword(token, req.body)
  
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password reset successfully",
        data: result

    })
})

export const authController = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}