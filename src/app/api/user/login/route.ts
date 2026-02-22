import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "lib/db";
import User from "lib/models/user";
import { generateJwtToken } from "lib/auth";

export const POST = async (request: NextRequest) => {
  try {
    await connectDb();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Please add all fields" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not exist" }, { status: 400 });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return NextResponse.json({ message: "Wrong Password" }, { status: 400 });
    }

    return NextResponse.json(
      {
        token: generateJwtToken({
          _id: user._id,
          name: user.name,
          email: user.email,
        }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
