"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function createTicket(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    throw new Error("Unauthorized");
  }

  const categoryName = formData.get("category") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;

  // Ensure category exists
  let category = await prisma.category.findUnique({
    where: { name: categoryName }
  });

  if (!category) {
    category = await prisma.category.create({
      data: { name: categoryName }
    });
  }
  
  // Ensure the user exists
  let user = await prisma.user.findUnique({
    where: { email: session.user.email! }
  });

  if (!user) {
    throw new Error("Student profile not found. Please log out and sign up.");
  }

  const ticket = await prisma.ticket.create({
    data: {
      location,
      description,
      categoryId: category.id,
      creatorId: user.id,
      status: "OPEN"
    }
  });

  await prisma.statusHistory.create({
    data: {
      ticketId: ticket.id,
      status: "OPEN",
      changedBy: "STUDENT"
    }
  });

  redirect("/student/dashboard");
}
