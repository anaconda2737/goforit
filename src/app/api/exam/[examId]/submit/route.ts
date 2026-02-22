import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "lib/db";
import Exam from "lib/models/exam";
import { ApiError } from "lib/api-error";

type RouteParams = {
  params: Promise<{ examId: string }>;
};

export const POST = async (request: NextRequest, context: RouteParams) => {
  try {
    await connectDb();
    const { examId } = await context.params;
    const body = await request.json().catch(() => null);

    if (!mongoose.Types.ObjectId.isValid(examId)) {
      throw new ApiError("Invalid exam id", 400);
    }

    if (!body || typeof body !== "object" || !Array.isArray(body.answers)) {
      throw new ApiError("Invalid answers", 400);
    }

    const exam = await Exam.findById(examId).lean();
    if (!exam) {
      throw new ApiError("Exam not found", 404);
    }

    const answers: Array<number | null> = body.answers;
    const totalQuestions = exam.questions?.length || 0;
    let score = 0;
    let totalMarks = 0;

    (exam.questions || []).forEach((q: any, index: number) => {
      const marks = q.marks || 1;
      totalMarks += marks;
      if (answers[index] === q.correctOption) {
        score += marks;
      }
    });

    const attempted = answers.filter((a) => typeof a === "number").length;
    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;

    return NextResponse.json(
      {
        title: exam.title,
        examType: exam.examType,
        totalQuestions,
        attempted,
        score,
        totalMarks,
        percentage: Number(percentage.toFixed(2)),
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
