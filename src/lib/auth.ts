import { NextRequest } from "next/server";
import { sign, verify, type SignOptions } from "jsonwebtoken";
import { ApiError } from "./api-error";

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
};

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }
  return secret;
};

const extractToken = (request: NextRequest) => {
  const raw = request.headers.get("authorization");

  if (!raw) return null;

  if (raw.startsWith("Bearer ")) {
    return raw.slice("Bearer ".length).trim();
  }

  if (raw.startsWith('"') && raw.endsWith('"')) {
    return raw.slice(1, -1);
  }

  return raw.replace(/^"+|"+$/g, "");
};

export const requireAuthUser = (request: NextRequest): AuthUser => {
  const token = extractToken(request);

  if (!token) {
    throw new ApiError("Unauthorized", 401);
  }

  try {
    return verify(token, getJwtSecret()) as AuthUser;
  } catch (error: any) {
    if (error?.message === "jwt expired") {
      throw new ApiError("Unauthorized", 401);
    }
    throw new ApiError("Error", 400);
  }
};

export const generateJwtToken = (payload: string | object | Buffer) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRE || "7d") as SignOptions["expiresIn"],
  };
  return sign(payload, getJwtSecret(), options);
};
