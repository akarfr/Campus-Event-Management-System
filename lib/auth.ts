"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

type payload = {
  id: number;
  role: "ORGANIZER" | "ATTENDEE";
};

import prisma from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function generateToken(data: payload) {
  return await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function decodeToken(token: string) {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });

  return payload as payload;
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;

  if (!session) return null;

  return await decodeToken(session);
}

export async function getCurrentUser() {
  const session = (await cookies()).get("session")?.value;

  if (!session) return null;

  const { id } = await decodeToken(session);

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      fullname: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    return null;
  }

  return user;
}
