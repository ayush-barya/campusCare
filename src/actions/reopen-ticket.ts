"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function reopenTicket(id: string | number) {
  const session = await getServerSession(authOptions);
  const ticketId = parseInt(id.toString(), 10);
  
  if (!session || session.user.role !== "STUDENT") {
    throw new Error("Unauthorized");
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId }
  });

  if (!ticket || ticket.creatorId !== session.user.id) {
    throw new Error("Access denied");
  }

  if (ticket.status !== "RESOLVED" && ticket.status !== "WAITING_CONFIRMATION") {
    throw new Error("Only resolved tickets can be reopened");
  }

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { status: "REOPENED" }
  });

  await prisma.statusHistory.create({
    data: {
      ticketId,
      status: "REOPENED",
      changedBy: "STUDENT"
    }
  });

  revalidatePath(`/student/ticket/${ticketId}`);
  revalidatePath(`/student/dashboard`);
}
