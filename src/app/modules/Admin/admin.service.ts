import { admin, Prisma, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../../helper/paginationHelper";
import prisma from "../../shared/prisma";
import { TAdminFilterReq } from "./admin.interface";
import { TPagination } from "../../interfaces/pagination.types";

const getAllAdmin = async (params: TAdminFilterReq, options: TPagination ) => {
  console.log({ params });

  const { limit, page, sortBy, sortOrder, skip } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const condition: Prisma.adminWhereInput[] = [];
  // if(params.searchTerm){
  //     condition.push({
  //         OR: [
  //             { name: {
  //                  contains: params.searchTerm,
  //                  mode: 'insensitive'
  //              }},
  //              {
  //                  email: {
  //                      contains: params.searchTerm,
  //                      mode: 'insensitive'
  //                  }
  //              }
  //             ]
  //     })

  // }

  if (params.searchTerm) {
    condition.push({
      OR: ["name", "email"].map((e) => ({
        [e]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    condition.push({
      AND: Object.keys(filterData).map((e) => ({
        [e]: {
          equals: filterData[e],
        },
      })),
    });
  }

  condition.push({
    isDeleted: false,
  });
  const whereConditions: Prisma.adminWhereInput = { AND: condition };
  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "asc",
          },
  });

  const total = await prisma.admin.count({
    where: whereConditions,
  });
  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  data: Partial<admin>
): Promise<admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

const deleteFromDB = async (id: string): Promise<admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedDate = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: adminDeletedDate.email,
      },
    });

    return adminDeletedDate;
  });

  return result;
};

const softDeleteFromDB = async (id: string): Promise<admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedDate = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: adminDeletedDate.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminDeletedDate;
  });

  return result;
};

export const AdminService = {
  getAllAdmin,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
