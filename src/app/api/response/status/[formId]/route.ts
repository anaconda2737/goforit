import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "lib/db";
import ResponseModel from "lib/models/response";
import { requireAuthUser } from "lib/auth";
import { ApiError } from "lib/api-error";

type RouteParams = {
  params: Promise<{ formId: string }>;
};

export const GET = async (request: NextRequest, context: RouteParams) => {
  try {
    await connectDb();
    const user = requireAuthUser(request);
    const { formId } = await context.params;

    const data = await ResponseModel.findOne({
      formId,
      userId: user._id,
    });

    return NextResponse.json({ status: !!data }, { status: 200 });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
