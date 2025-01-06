"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldValues, useForm } from "react-hook-form";
import { RiAddLine } from "react-icons/ri";
import { DateTimePicker } from "./ui/datetime-picker";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { set } from "date-fns";

export default function AddEventDialog() {
  const [dateTime, setDateTime] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  async function addEvent(data: FieldValues) {
    setLoading(true);

    const { dateandtime, ...rest } = data;

    await axios
      .post("/api/event", { ...rest, dateTime })
      .then(() => {
        reset();
        setDateTime(undefined);
        setOpen(false);
        router.refresh();
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <RiAddLine /> Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add an event</DialogTitle>
          <DialogDescription>
            Add event details here. Click create when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(addEvent)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              disabled={loading}
              className="col-span-3"
              {...register("name", { required: true })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              disabled={loading}
              className="col-span-3"
              {...register("location", { required: true })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Date and Time
            </Label>
            <div className="flex w-72 flex-col gap-2">
              <DateTimePicker
                disabled={loading}
                hourCycle={12}
                value={dateTime}
                {...register("dateandtime", { required: true })}
                onChange={setDateTime}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Input
              id="type"
              disabled={loading}
              className="col-span-3"
              {...register("type", { required: true })}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
