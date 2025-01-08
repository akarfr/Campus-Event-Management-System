"use client";

import axios from "axios";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function Event({
  id,
  name,
  location,
  dateTime,
  type,
  status,
  authenticated,
}: {
  id: number;
  name: string;
  location: string;
  dateTime: Date;
  type: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  authenticated: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleRequestAttendance() {
    if (!authenticated) {
      return router.push("/sign-in");
    }

    setIsLoading(true);

    await axios
      .post(`/api/event/${id}/attend`)
      .then(() => {
        toast({
          title: `Attendance Requested for ${name}`,
        });
        router.refresh();
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="p-4 border rounded-lg w-full lg:w-[24%]">
      <div className="flex flex-row justify-between">
        <h2 className="text-xl font-semibold">{name}</h2>
        {status && (
          <div
            className={clsx(
              "flex justify-center items-center px-3 rounded-full text-xs font-semibold",
              {
                "bg-amber-500/20 text-amber-500": status === "PENDING",
                "bg-green-500/20 text-green-500": status === "APPROVED",
                "bg-red-500/20 text-red-500": status === "REJECTED",
              }
            )}
          >
            {status}
          </div>
        )}
      </div>
      <p className="text-gray-500">{location}</p>
      <p className="text-gray-500">{dateTime.toLocaleString()}</p>
      <p className="text-gray-500">{type}</p>
      <Button
        onClick={handleRequestAttendance}
        disabled={isLoading || !!status}
        className="mt-2 w-full"
      >
        {!!status ? "Requested" : "Request Attendance"}
      </Button>
    </div>
  );
}
