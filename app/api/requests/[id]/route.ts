import db from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { sendMail } from "@/service/mailService";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser();
    const Data = await request.json();
    const { status } = Data;
    const requestId = parseInt((await params).id);

    if (!status) {
      return new NextResponse("Missing info", { status: 400 });
    }

    if (status != "APPROVED" && status != "REJECTED") {
      return new NextResponse("Bad Request", { status: 400 });
    }

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (currentUser.role != "ORGANIZER") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const attendRequest = await db.attend.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!attendRequest) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (attendRequest.status != "PENDING") {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const updatedRequest = await db.attend.update({
      where: {
        id: requestId,
      },
      data: {
        status,
      },
      select: {
        event: true,
        user: true,
      },
    });

    await sendMail({
      email: updatedRequest.user.email,
      subject: `Attendance Request for ${updatedRequest.event.name} Event`,
      html: `<h1 style="font-size: 24px; font-weight: 500;">Hi ${
        updatedRequest.user.fullname
      },</h1>
      <p style="font-size: 16px;">Your attendance request for ${
        updatedRequest.event.name
      } has been ${status.toLowerCase()}.</p>
      <p style="margin-top: 8px; font-size: 16px;">You can check the status of your request by visiting the event page.</p>
      `,
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
