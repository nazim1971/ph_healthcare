import express, { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
 try {
  console.log(req.body);
  const result = await userService.createAdmin(req.body);
  res.status(200).json({
    success: true,
    message: "Admin Created Successfully",
    data: result
  })
 } catch (error) {
  res.status(500).json({
    success: false,
    message: error?.name || "Something went wrong",
    error: error
  })
 }
};

export const userController = {
  createAdmin,
};
