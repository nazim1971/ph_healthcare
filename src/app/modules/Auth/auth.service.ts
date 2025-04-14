import prisma from "../../shared/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginUser = async (payload: { email: string; password: string }) => {
  console.log("User login");
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
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

  const accessToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "Nazim",
    {
      algorithm: "HS256",
      expiresIn: "5m",
    }
  );

  const refreshToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "pokpok",
    {
      algorithm: "HS256",
      expiresIn: "30d",
    }
  );

  console.log(accessToken);
  console.log(isPasswordCorrect);
  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const authServices = {
  loginUser,
};
