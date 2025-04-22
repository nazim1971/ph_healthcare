import httpStatus from 'http-status';
import prisma from "../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtHelpers } from "../../../helper/jwtHelper";
import { UserStatus } from "@prisma/client";
import config from "../../config";
import emailSender from "../../../helper/emailSender";
import ApiError from "../../error/ApiError";

const loginUser = async (payload: { email: string; password: string }) => {
  console.log("User login");
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  console.log({ payload });

  const isPasswordCorrect: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isPasswordCorrect) {
    throw new Error("Password Incorrect");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwtS,
    config.jwtExp
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.refreshS,
    config.refreshExp
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(token, "duckduck") as JwtPayload;
  } catch (error) {
    throw new Error("You are not authorized");
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "Nazim",
    "5m"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  console.log("user", user, "payload", payload);
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });
  const isPasswordCorrect: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isPasswordCorrect) {
    throw new Error("Password Incorrect");
  }
  const hasedPass: string = await bcrypt.hash(payload.newPassword, 12);
  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hasedPass,
      needPasswordChange: false,
    },
  });
  return {
    message: "Password changed successfully",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPassToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.resetPassS,
    config.resetPassExp
  );

  console.log({ resetPassToken });
  const resetPassLink =
    config.resetPassLink + `?userId=${userData.id}&token=${resetPassToken}`;

  await emailSender(
    userData.email,

    `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa;">
    <h2 style="color: #333;">Password Reset Request</h2>
    <p>Hello <strong>${userData.email}</strong>,</p>
    <p>We received a request to reset your password. Click the button below to reset it:</p>
    <a href="${resetPassLink}" style="
      display: inline-block;
      padding: 10px 20px;
      margin-top: 10px;
      background-color: #007bff;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
    ">Reset Password</a>
    <p style="margin-top: 20px;">If you didn't request this, you can ignore this email.</p>
    <p>Thanks,<br/>Your Support Team</p>
  </div>
    `
  );
  console.log(resetPassLink);
  // http://localhost:5000/reset-pass?
};

const resetPassword = async (
  token: string,
  payload: {
    id: string;
    password: string;
  }
) => {
  const userData = await prisma.user.findFirstOrThrow({
    where:{
      id: payload?.id,
      status: UserStatus.ACTIVE
    }
  })

  const isValidToken = jwtHelpers.verifyToken(token, config.resetPassS);
  console.log({isValidToken});
  if(!isValidToken){
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden")
  }

  const hasedPass: string = await bcrypt.hash(payload.password, 12);
  await prisma.user.update({
    where:{
      id: userData.id
    },
    data: {
      password: hasedPass
    }
  })
};

export const authServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
