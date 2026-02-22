import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "lib/db";
import Exam from "lib/models/exam";
import { ApiError } from "lib/api-error";
import { requireAdminUser } from "lib/admin";

type RouteParams = {
  params: Promise<{ examId: string }>;
};

export const GET = async (_request: NextRequest, context: RouteParams) => {
  try {
    await connectDb();
    const { examId } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(examId)) {
      throw new ApiError("Invalid exam id", 400);
    }

    const exam = await Exam.findById(examId).lean();
    if (!exam) {
      throw new ApiError("Exam not found", 404);
    }

    return NextResponse.json(
      {
        _id: exam._id,
        title: exam.title,
        examType: exam.examType,
        description: exam.description,
        durationMinutes: exam.durationMinutes,
        questions: (exam.questions || []).map((q: any, idx: number) => ({
          id: idx,
          question: q.question,
          options: q.options,
          marks: q.marks || 1,
        })),
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

export const DELETE = async (request: NextRequest, context: RouteParams) => {
  try {
    await connectDb();
    const user = requireAdminUser(request);
    const { examId } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(examId)) {
      throw new ApiError("Invalid exam id", 400);
    }

    const exam = await Exam.findById(examId, { createdBy: 1 });
    if (!exam) {
      throw new ApiError("Exam not found", 404);
    }

    if (exam.createdBy.toString() !== user._id) {
      throw new ApiError("Forbidden", 403);
    }

    await Exam.findByIdAndDelete(examId);
    return NextResponse.json({ message: "Exam deleted" }, { status: 200 });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
