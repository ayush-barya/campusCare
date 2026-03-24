"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export async function assignTicket(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const parsedTicketId = parseInt(formData.get("ticketId") as string, 10);
  const workerId = formData.get("workerId") as string;
  const priority = formData.get("priority") as string || "MEDIUM";

  const worker = await prisma.worker.findUnique({
    where: { id: workerId }
  });

  if (!worker) {
    throw new Error("Specified worker does not exist.");
  }

  let workerPhone = worker.phone;
  if (workerPhone.length === 10 && /^\d+$/.test(workerPhone)) {
    workerPhone = `+91${workerPhone}`;
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: parsedTicketId },
    include: { creator: true, category: true }
  });

  if (!ticket || ticket.status !== "OPEN" && ticket.status !== "REOPENED") {
    throw new Error("Invalid ticket or status");
  }

  // 1. Create assignment record
  await prisma.assignment.create({
    data: {
      ticketId: parsedTicketId,
      workerId
    }
  });

  // 2. Change ticket status, priority, and generate secure worker token
  const workerToken = randomUUID();
  await prisma.ticket.update({
    where: { id: parsedTicketId },
    data: {
      status: "ASSIGNED",
      priority,
      workerToken
    }
  });

  // 3. Status History
  await prisma.statusHistory.create({
    data: {
      ticketId: parsedTicketId,
      status: "ASSIGNED",
      changedBy: "ADMIN"
    }
  });

  console.log(`\n\n[MOCK SMS SERVICE TRIGGERED]`);
  console.log(`To: ${workerPhone} (${worker.name})`);
  console.log(`Message: [${priority} Priority] IIML Maintenance Ticket #${parsedTicketId}`);
  console.log(`Issue: ${ticket.description.slice(0, 50)}...`);
  console.log(`Location: ${ticket.location}`);
  console.log(`Student: ${ticket.creator.name} (${ticket.creator.phone}) Room: ${ticket.creator.roomNumber}`);
  console.log(`\n[WORKER TESTING LINK]: http://localhost:3000/resolve/${workerToken}`);
  console.log(`\n\n`);

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID!;
    const authToken = process.env.TWILIO_AUTH_TOKEN!;
    const messagingSid = process.env.TWILIO_MESSAGING_SERVICE_SID!;

    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {

      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'To': workerPhone,
        'MessagingServiceSid': messagingSid,
        'Body': `IIML Ticket #${parsedTicketId}\nPriority: ${priority}\nIssue: ${ticket.category.name}\nLoc: ${ticket.location}\nStudent: ${ticket.creator.name}\nRoom: ${ticket.creator.roomNumber}\nPh: ${ticket.creator.phone}\nAlt: ${ticket.creator.altPhone || 'N/A'}\nClick to resolve: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/resolve/${workerToken}`
      })
    });
    console.log("[TWILIO POST SENT]");
  } catch (e) { console.error("Twilio Error:", e); }

  revalidatePath(`/admin/dashboard`);
}
