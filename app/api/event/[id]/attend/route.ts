import db from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser();

    const eventId = parseInt((await params).id);

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const existingRequest = await db.attend.findFirst({
      where: {
        userId: currentUser.id,
        eventId,
      },
    });

    if (existingRequest) {
      return new NextResponse("Already Requested", { status: 400 });
    }

    const request = await db.attend.create({
      data: {
        userId: currentUser.id,
        eventId,
      },
    });

    return NextResponse.json(request);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
