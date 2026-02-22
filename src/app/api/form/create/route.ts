import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "lib/db";
import Form from "lib/models/form";
import Template from "lib/models/template";
import { requireAuthUser } from "lib/auth";
import { ApiError } from "lib/api-error";
import { templates } from "json";

export const POST = async (request: NextRequest) => {
  try {
    await connectDb();
    const user = requireAuthUser(request);
    const { templateId } = await request.json().catch(() => ({}));

    const [formDetail] = await Template.aggregate([
      {
        $match: {
          ...(templateId
            ? { _id: new mongoose.Types.ObjectId(templateId) }
            : { isDefault: true }),
        },
      },
      {
        $project: {
          _id: 0,
          title: 1,
          colorCode: 1,
          bgCode: 1,
          sections: 1,
          creatorId: user._id,
        },
      },
      { $unset: ["sections._id", "sections.fields._id"] },
    ]);

    const fallbackTemplate = templates.starterTemplate;
    const payload = formDetail || {
      title: fallbackTemplate.title,
      colorCode: fallbackTemplate.colorCode,
      bgCode: fallbackTemplate.bgCode,
      sections: fallbackTemplate.sections,
    };

    const form = await Form.create({
      ...payload,
      creatorId: user._id,
    });

    return NextResponse.json(
      {
        _id: form._id,
        title: form.title,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
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
