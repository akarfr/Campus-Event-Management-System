import db from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (currentUser.role != "ORGANIZER") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const requests = await db.attend.findMany({
      include: {
        event: true,
        user: true,
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
