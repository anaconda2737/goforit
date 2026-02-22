import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "lib/db";
import Exam from "lib/models/exam";
import { ApiError } from "lib/api-error";
import { requireAdminUser } from "lib/admin";

export const POST = async (request: NextRequest) => {
  try {
    await connectDb();
    const user = requireAdminUser(request);
    const body = await request.json().catch(() => null);

    if (!body) {
      throw new ApiError("Invalid data", 400);
    }

    const { title, examType, description = "", durationMinutes = 30, questions } = body;

    if (!title || !examType || !Array.isArray(questions) || questions.length === 0) {
      throw new ApiError("title, examType and questions are required", 400);
    }

    const exam = await Exam.create({
      title,
      examType,
      description,
      durationMinutes,
      questions,
      createdBy: user._id,
    });

    return NextResponse.json(
      {
        _id: exam._id,
        title: exam.title,
        examType: exam.examType,
        updatedAt: exam.updatedAt,
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
