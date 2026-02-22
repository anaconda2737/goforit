import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "lib/db";
import Form from "lib/models/form";
import { ApiError } from "lib/api-error";
import { requireAuthUser } from "lib/auth";

type RouteParams = {
  params: Promise<{ formId: string }>;
};

export const GET = async (_request: NextRequest, context: RouteParams) => {
  try {
    await connectDb();
    const { formId } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(formId)) {
      throw new ApiError("Invalid form id", 400);
    }

    const formDetail = await Form.findById(formId);

    if (!formDetail) {
      throw new ApiError("Form not found", 400);
    }

    return NextResponse.json(formDetail, { status: 200 });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export const PUT = async (request: NextRequest, context: RouteParams) => {
  try {
    await connectDb();
    const user = requireAuthUser(request);
    const { formId } = await context.params;
    const body = await request.json().catch(() => null);

    if (!mongoose.Types.ObjectId.isValid(formId)) {
      throw new ApiError("Invalid form id", 400);
    }

    const form = await Form.findById(formId, { creatorId: 1 });

    if (form && form.creatorId.toString() !== user._id) {
      throw new ApiError("Form creator only have edit access", 400);
    }

    if (!body) {
      throw new ApiError("Invalid data", 400);
    }

    await Form.findByIdAndUpdate(formId, body);

    return NextResponse.json(
      { message: "Form has been updated successfully", formId },
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

export const DELETE = async (request: NextRequest, context: RouteParams) => {
  try {
    await connectDb();
    requireAuthUser(request);
    const { formId } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(formId)) {
      throw new ApiError("Invalid form id", 400);
    }

    await Form.findByIdAndDelete(formId);

    return NextResponse.json(
      { message: "Form has been deleted successfully", formId },
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
