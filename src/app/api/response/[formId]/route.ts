import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "lib/db";
import Form from "lib/models/form";
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

    const [formDetail] = await Form.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(formId) } },
      {
        $project: {
          creatorId: 1,
          colorCode: 1,
          bgCode: 1,
          title: 1,
          fields: {
            $reduce: {
              input: "$sections",
              initialValue: [],
              in: {
                $concatArrays: [
                  "$$value",
                  {
                    $map: {
                      input: "$$this.fields",
                      as: "field",
                      in: { _id: "$$field._id", title: "$$field.title" },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ]);

    if (!formDetail) {
      throw new ApiError("Form not found", 400);
    }

    if (formDetail.creatorId.toString() !== user._id) {
      throw new ApiError(
        "Form creator only have the access to view the submitted responses",
        400
      );
    }

    const data = await ResponseModel.aggregate([
      {
        $match: { formId: new mongoose.Types.ObjectId(formId) },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
          as: "user",
          pipeline: [{ $project: { name: 1, email: 1 } }],
        },
      },
      {
        $project: {
          responses: 1,
          user: { $first: "$user" },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    formDetail.formResponses = data || [];

    return NextResponse.json(formDetail, { status: 200 });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
