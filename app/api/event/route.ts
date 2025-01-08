import db from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const events = await db.event.findMany();

    return NextResponse.json(events);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const Data = await request.json();
    const { name, location, dateTime, type } = Data;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (currentUser.role != "ORGANIZER") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (!name || !location || !dateTime || !type) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const event = await db.event.create({
      data: {
        name,
        location,
        dateTime,
        type,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
