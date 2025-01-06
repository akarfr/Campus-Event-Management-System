"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { useForm, FieldValues } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  function checkPassword(password: string) {
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    return regex.test(password);
  }

  async function SignUp(data: FieldValues) {
    setLoading(true);

    if (data.password !== data.confirmpassword) {
      setLoading(false);
      return setError("confirmpassword", {
        type: "manual",
        message: "Passwords do not match",
      });
    }

    if (!checkPassword(data.password)) {
      setLoading(false);
      return setError("password", {
        type: "manual",
        message:
          "Password must be at least 8 characters long and contain at least one letter, one number, and one special character",
      });
    } else {
      clearErrors("password");
    }

    await axios
      .post("/api/register", data)
      .then(() => router.push("/"))
      .catch((error) => {
        setError("email", {
          type: "manual",
          message: error.response.data,
        });
      })
      .finally(() => setLoading(false));
  }

  return (
    <form
      onSubmit={handleSubmit(SignUp)}
      className="flex h-screen flex-col justify-center items-center p-8"
    >
      <div className="w-full md:w-1/2">
        <h1 className="mb-4 text-4xl font-semibold">Sign In</h1>
        <div className="mb-2">
          <Label htmlFor="fullname">Full Name</Label>
          <Input
            autoComplete="full-name"
            id="fullname"
            type="text"
            disabled={loading}
            placeholder="Full Name"
            {...register("fullname", { required: true })}
            className={clsx(errors.fullname && "border-red-500")}
          />
          {errors.fullname && (
            <p className="text-sm mt-1 text-red-500">
              {errors.fullname.message
                ? (errors.fullname.message as string)
                : "Please enter your fullname."}
            </p>
          )}
        </div>
        <div className="mb-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            autoComplete="email"
            id="email"
            type="email"
            disabled={loading}
            placeholder="Email"
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
            placeholder="Password"
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
        <div className="mb-2">
          <Label htmlFor="confirmpassword">Confirm Password</Label>
          <Input
            autoComplete="off"
            id="confirmpassword"
            type="password"
            disabled={loading}
            placeholder="Confirm Password"
            {...register("confirmpassword", { required: true })}
            className={clsx(errors.confirmpassword && "border-red-500")}
          />
          {errors.confirmpassword && (
            <p className="text-sm mt-1 text-red-500">
              {errors.confirmpassword.message
                ? (errors.confirmpassword.message as string)
                : "Please re-enter your password"}
            </p>
          )}
        </div>
        <Button
          disabled={
            !!errors.email || !!errors.password || !!errors.confirmpassword || loading
          }
          className="w-full"
        >
          Sign In
        </Button>
      </div>
    </form>
  );
}
