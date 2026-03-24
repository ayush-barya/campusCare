"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function processReopenToken(reopenToken: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { reopenToken }
  });

  if (!ticket || (ticket.status !== "RESOLVED" && ticket.status !== "WAITING_CONFIRMATION")) {
    return { error: "Invalid link, or the ticket is no longer in a waiting state." };
  }

  // Update status to REOPENED
  await prisma.ticket.update({
    where: { reopenToken },
    data: { 
      status: "REOPENED"
    }
  });

  await prisma.statusHistory.create({
    data: {
      ticketId: ticket.id,
      status: "REOPENED",
      changedBy: "STUDENT"
    }
  });

  revalidatePath(`/admin/dashboard`);
  revalidatePath(`/student/dashboard`);
  revalidatePath(`/reopen/${reopenToken}`, "page");
  
  return { success: true };
}
