import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "lib/db";
import { ApiError } from "lib/api-error";
import Exam from "lib/models/exam";
import { requireAdminUser } from "lib/admin";

export const GET = async (request: NextRequest) => {
  try {
    await connectDb();
    const user = requireAdminUser(request);

    const exams = await Exam.find(
      { createdBy: user._id },
      { title: 1, examType: 1, durationMinutes: 1, questions: 1, updatedAt: 1 }
    )
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json(
      exams.map((exam: any) => ({
        _id: exam._id,
        title: exam.title,
        examType: exam.examType,
        durationMinutes: exam.durationMinutes,
        totalQuestions: exam.questions?.length || 0,
        updatedAt: exam.updatedAt,
      })),
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
