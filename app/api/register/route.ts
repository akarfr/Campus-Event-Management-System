import bcrypt from "bcrypt";

import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const Data = await request.json();
    const { email, password, fullname } = Data;

    if (!email || !password || !fullname) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!regex.test(password)) {
      return new NextResponse("Password didn't meet the requirements.", { status: 400 });
    }

    const doesUserExist = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (doesUserExist) {
      return new NextResponse("User with this email already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        fullname,
        email,
        hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
