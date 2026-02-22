import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "lib/db";
import ResponseModel from "lib/models/response";
import { requireAuthUser } from "lib/auth";
import { ApiError } from "lib/api-error";

export const POST = async (request: NextRequest) => {
  try {
    await connectDb();
    const user = requireAuthUser(request);
    const body = await request.json().catch(() => null);

    if (!body) {
      throw new ApiError("Invalid data", 400);
    }

    await ResponseModel.create({ ...body, userId: user._id });

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
