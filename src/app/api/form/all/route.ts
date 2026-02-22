import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "lib/db";
import Form from "lib/models/form";
import { requireAuthUser } from "lib/auth";
import { ApiError } from "lib/api-error";

export const GET = async (request: NextRequest) => {
  try {
    await connectDb();
    const user = requireAuthUser(request);

    const limit = request.nextUrl.searchParams.get("limit")
      ? Number(request.nextUrl.searchParams.get("limit"))
      : 25;
    const page = request.nextUrl.searchParams.get("page")
      ? Number(request.nextUrl.searchParams.get("page"))
      : 1;
    const search = request.nextUrl.searchParams.get("search");
    const skip = (page - 1) * limit;

    const filterQuery = {
      creatorId: user._id,
      ...(search && {
        title: { $regex: search, $options: "i" },
      }),
    };

    const total = await Form.find(filterQuery).countDocuments();

    const forms = await Form.find(filterQuery, {
      title: 1,
      updatedAt: 1,
      createdAt: 1,
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(skip);

    return NextResponse.json(
      {
        list: forms,
        pageMeta: {
          page,
          total,
          totalPages: Math.ceil(total / limit),
        },
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
