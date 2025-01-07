import bcrypt from "bcrypt";

import db from "@/lib/db";
import { sendMail } from "@/service/mailService";
import { NextResponse } from "next/server";
import { generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const Data = await request.json();
    const { email, password } = Data;

    if (!email || !password) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return new NextResponse("Invalid email or password", { status: 400 });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.hashedPassword);

    if (!isCorrectPassword) {
      return new NextResponse("Invalid email or password", { status: 400 });
    }

    const session = await generateToken({
      id: user.id,
      role: user.role,
    });

    const response = NextResponse.json(
      { id: user.id, email: user.email },
      { status: 200 }
    );

    response.cookies.set({
      name: "session",
      value: session,
      httpOnly: true,
      maxAge: 30 * 86400,
    });

    return response;
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
