"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Event, User } from "@prisma/client";
import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Request({
  id,
  event,
  status,
  user,
}: {
  id: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  event: Event;
  user: User;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleRequestAttendance(status: "APPROVED" | "REJECTED") {
    setIsLoading(true);

    await axios
      .post(`/api/requests/${id}`, { status })
      .then(() => {
        toast({
          title: `Attendance ${status == "APPROVED" ? "Approved" : "Rejected"} for ${
            user.fullname
          }`,
        });
        router.refresh();
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="p-4 h-fit rounded-lg border">
      <h1 className="font-semibold">{user.fullname}</h1>
      <h1 className="text-gray-500 text-xs">{user.email}</h1>
      <p className="text-lg mt-4">Event: {event.name}</p>
      <div
        className={clsx(
          "flex justify-center items-center mt-2 p-1 px-3 rounded-md font-semibold",
          {
            "bg-amber-500/20 text-amber-500": status === "PENDING",
            "bg-green-500/20 text-green-500": status === "APPROVED",
            "bg-red-500/20 text-red-500": status === "REJECTED",
          }
        )}
      >
        {status}
      </div>
      {status == "PENDING" && (
        <div className="flex gap-2 mt-2 w-full">
          <Button
            disabled={isLoading}
            onClick={() => handleRequestAttendance("APPROVED")}
            className="bg-green-500/20 text-green-500 hover:bg-green-500/30 w-full font-semibold rounded-lg text-lg p-4"
          >
            Approve
          </Button>
          <Button
            disabled={isLoading}
            onClick={() => handleRequestAttendance("REJECTED")}
            className="bg-red-500/20 text-red-500 hover:bg-red-500/30 w-full font-semibold rounded-lg text-lg p-4"
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}
