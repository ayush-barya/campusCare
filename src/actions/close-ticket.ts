"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function closeTicket(id: string | number) {
  const session = await getServerSession(authOptions);
  const ticketId = parseInt(id.toString(), 10);
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId }
  });

  if (!ticket) {
    throw new Error("Invalid ticket");
  }

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { status: "CLOSED" }
  });

  await prisma.statusHistory.create({
    data: {
      ticketId,
      status: "CLOSED",
      changedBy: "ADMIN"
    }
  });

  revalidatePath(`/admin/dashboard`);
}
