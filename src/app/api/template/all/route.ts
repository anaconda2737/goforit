import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "lib/db";
import Template from "lib/models/template";
import { requireAuthUser } from "lib/auth";
import { ApiError } from "lib/api-error";

export const GET = async (request: NextRequest) => {
  try {
    await connectDb();
    requireAuthUser(request);

    const templates = await Template.find(
      { isDefault: false },
      { title: 1, createdAt: 1, updatedAt: 1 }
    );

    return NextResponse.json(templates, { status: 200 });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
