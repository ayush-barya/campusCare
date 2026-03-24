"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export async function submitWorkerResolution(workerToken: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { workerToken },
    include: { creator: true, category: true }
  });

  if (!ticket || ticket.status !== "ASSIGNED") {
    throw new Error("Ticket cannot be resolved. It may already be resolved or not yet assigned.");
  }

  // 1. Update status and tokens
  const reopenToken = randomUUID();
  await prisma.ticket.update({
    where: { workerToken },
    data: {
      status: "WAITING_CONFIRMATION",
      reopenToken
    }
  });

  // 2. Status History
  await prisma.statusHistory.create({
    data: {
      ticketId: ticket.id,
      status: "WAITING_CONFIRMATION",
      changedBy: "WORKER"
    }
  });

  // 3. Trigger SMS to Student
  let studentPhone = ticket.creator.phone;
  if (studentPhone) {
    if (studentPhone.length === 10 && /^\d+$/.test(studentPhone)) {
      studentPhone = `+91${studentPhone}`;
    }

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
          'To': studentPhone,
          'MessagingServiceSid': messagingSid,
          'Body': `CampusCare: Your issue '#${ticket.id}' has been marked RESOLVED by the worker.\n\nIssue Details: ${ticket.category.name} at ${ticket.location}\n\nNot fixed? Click here to reopen: ${(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')}/reopen/${reopenToken}\n\nTicket will auto-close in 24 hours.`
        })
      });
      console.log(`[TWILIO STUDENT POST SENT TO ${studentPhone}]`);
    } catch (e) { console.error("Twilio Student Error:", e); }
  }

  revalidatePath(`/resolve/${workerToken}`);
  revalidatePath(`/admin/dashboard`);
  revalidatePath(`/student/dashboard`);
}
