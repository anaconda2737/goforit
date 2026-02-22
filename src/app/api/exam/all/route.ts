import { NextResponse } from "next/server";
import { connectDb } from "lib/db";
import Exam from "lib/models/exam";

export const GET = async () => {
  try {
    await connectDb();

    const exams = await Exam.find(
      {},
      { title: 1, examType: 1, description: 1, durationMinutes: 1, questions: 1, updatedAt: 1 }
    )
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json(
      exams.map((exam: any) => ({
        _id: exam._id,
        title: exam.title,
        examType: exam.examType,
        description: exam.description,
        durationMinutes: exam.durationMinutes,
        totalQuestions: exam.questions?.length || 0,
        updatedAt: exam.updatedAt,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
