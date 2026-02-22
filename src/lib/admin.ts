import { NextRequest } from "next/server";
import { ApiError } from "./api-error";
import { requireAuthUser } from "./auth";

export const requireAdminUser = (request: NextRequest) => {
  const user = requireAuthUser(request);
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    throw new ApiError("ADMIN_EMAIL is not configured", 500);
  }

  if (user.email.toLowerCase() !== adminEmail.toLowerCase()) {
    throw new ApiError("Forbidden", 403);
  }

  return user;
};
