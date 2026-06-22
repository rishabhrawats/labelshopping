"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";

export async function registerUser(formData: FormData) {
  const parsed = registerSchema.parse({
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? "").trim()
  });

  const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
  if (existing) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(parsed.password, 12);

  await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      passwordHash
    }
  });
}

