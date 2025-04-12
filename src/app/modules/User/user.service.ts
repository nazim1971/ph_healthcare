import {  UserRole } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import prisma from "../../shared/prisma";



const createAdmin = async (data:any) => {

  const hasedPass: string = await bcrypt.hash(data.password, 12);
  console.log(hasedPass); 
  console.log(data);
  const useData = {
    email: data.admin.email,
    password: hasedPass,
    role: UserRole.ADMIN
  }
 const result = await prisma.$transaction(async(transactionClient)=>{
  const createdUserData = await transactionClient.user.create({
      data: useData
  }) ;
  const createdAdminData = await transactionClient.admin.create({
    data: data.admin
  })

  return createdAdminData
 })
  return result
};

export const userService = { createAdmin };
