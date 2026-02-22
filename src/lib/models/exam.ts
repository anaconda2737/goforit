import mongoose, { Schema } from "mongoose";

const ExamQuestionSchema = new Schema(
  {
    question: { type: String, required: true },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (val: string[]) => Array.isArray(val) && val.length >= 2,
        message: "At least two options are required",
      },
    },
    correctOption: { type: Number, required: true },
    marks: { type: Number, default: 1 },
  },
  { _id: false }
);

const ExamSchema = new Schema(
  {
    title: { type: String, required: true },
    examType: { type: String, required: true },
    description: { type: String, default: "" },
    durationMinutes: { type: Number, default: 30 },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: {
      type: [ExamQuestionSchema],
      required: true,
      validate: {
        validator: (val: unknown[]) => Array.isArray(val) && val.length > 0,
        message: "At least one question is required",
      },
    },
  },
  { timestamps: true }
);

const Exam = mongoose.models.Exam || mongoose.model("Exam", ExamSchema);

export default Exam;
