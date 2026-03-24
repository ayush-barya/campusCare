"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function registerStudent(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const altPhone = formData.get("altPhone") as string;
  const roomNumber = formData.get("roomNumber") as string;
  const password = formData.get("password") as string;

  if (!email || !email.endsWith("@iiml.ac.in")) {
    return { error: "Must use a valid @iiml.ac.in email address." };
  }

  if (!name || !phone || !roomNumber) {
    return { error: "Name, phone, and room number are required." };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return { error: "Account with this email already exists. Please log in." };
  }

  try {
    await prisma.user.create({
      data: {
        email,
        password,
        name,
        phone,
        altPhone: altPhone || null,
        roomNumber,
        role: "STUDENT"
      }
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create account. Please try again." };
  }
}
