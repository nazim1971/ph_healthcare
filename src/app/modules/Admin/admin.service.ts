import { Prisma, PrismaClient } from "@prisma/client";
import { number } from "zod";

const prisma = new PrismaClient();

const getAllAdmin = async (params: any, options: any) => {
  console.log({ params });

  const calculatePagination = (options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const page: number = Number(options.page) || 1;
    const limit: number = Number(options.limit) || 10;
    const skip: number =  (Number(page) - 1) * limit ;
    const sortBy: string = options.sortBy || 'createdAt';
    const sortOrder: string = options.sortOrder || 'desc';
    return  {
        page, limit, skip, sortBy, sortOrder
    }
  };

  const { limit, page, sortBy, sortOrder, skip } = calculatePagination(options);
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
  return result;
};

export const AdminService = {
  getAllAdmin,
};
