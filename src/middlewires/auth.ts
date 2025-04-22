import  httpStatus  from 'http-status';
import { catchAsync } from "../app/shared/catchAsync";
import { CustomPayload } from "../app/interfaces";
import { UserRole } from "@prisma/client";
import config from "../app/config";
import { jwtHelpers } from "../helper/jwtHelper";
import ApiError from "../app/error/ApiError";

const auth = (...roles: UserRole[]) => {
    return catchAsync(async (req, _res, next) => {
      const token = req.headers.authorization;
  
      // checking if the token is missing
      if (!token) {
        throw new ApiError( httpStatus.UNAUTHORIZED,'You are not authorized!');
      }
  
      // checking if the given token is valid
      const decoded = jwtHelpers.verifyToken(
        token,
        config.jwtS,
      ) as CustomPayload;
      req.user = decoded;
      console.log(decoded);
      const { email, role } = decoded;
  
      if (roles.length && !roles.includes(role as UserRole)) {
        throw new ApiError(httpStatus.FORBIDDEN,'Forbidden');
      }
      next();
    });
  };
  
  export default auth;