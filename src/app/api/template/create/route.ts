import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "lib/db";
import Template from "lib/models/template";
import { requireAuthUser } from "lib/auth";
import { ApiError } from "lib/api-error";

export const POST = async (request: NextRequest) => {
  try {
    await connectDb();
    requireAuthUser(request);
    const body = await request.json().catch(() => null);

    if (!body) {
      throw new ApiError("Invalid data", 400);
    }

    const template = await Template.create(body);

    return NextResponse.json(
      {
        _id: template._id,
        title: template.title,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
