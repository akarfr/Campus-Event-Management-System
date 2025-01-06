"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, FieldValues } from "react-hook-form";

export default function SignIn() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  async function SignIn(data: FieldValues) {
    setLoading(true);

    await axios
      .post("/api/login", data)
      .then(() => router.push("/"))
      .catch((error) => {
        setError("email", {
          type: "manual",
          message: error.response.data,
        });
        setError("password", {
          type: "manual",
          message: " ",
        });
      })
      .finally(() => setLoading(false));
  }

  return (
    <form
      onSubmit={handleSubmit(SignIn)}
      className="flex h-screen flex-col justify-center items-center p-8"
    >
      <div className="w-full md:w-1/2">
        <h1 className="mb-4 text-4xl font-semibold">Sign In</h1>
        <div className="mb-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            autoComplete="email"
            id="email"
            type="email"
            disabled={loading}
            placeholder="email"
            {...register("email", { required: true })}
            className={clsx(errors.email && "border-red-500")}
          />
          {errors.email && (
            <p className="text-sm mt-1 text-red-500">
              {errors.email.message
                ? (errors.email.message as string)
                : "Please enter your email."}
            </p>
          )}
        </div>
        <div className="mb-2">
          <Label htmlFor="password">Password</Label>
          <Input
            autoComplete="off"
            id="password"
            type="password"
            disabled={loading}
            placeholder="password"
            {...register("password", { required: true })}
            className={clsx(errors.password && "border-red-500")}
          />
          {errors.password && (
            <p className="text-sm mt-1 text-red-500">
              {errors.password.message
                ? (errors.password.message as string)
                : "Please enter your password."}
            </p>
          )}
        </div>
        <Button
          disabled={!!errors.email || !!errors.password || loading}
          className="w-full"
        >
          Sign In
        </Button>
      </div>
    </form>
  );
}
