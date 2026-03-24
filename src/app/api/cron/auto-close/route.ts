import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // 1. Find tickets that are RESOLVED or WAITING_CONFIRMATION
    // and where their last updatedAt was more than 24 hours ago.
    
    // For MVP/Demo purposes, we will treat 'more than 1 minute ago' as the threshold if a query param is passed
    const { searchParams } = new URL(request.url);
    const demoMode = searchParams.has('demo');
    
    const cutoffTime = new Date();
    if (demoMode) {
      cutoffTime.setMinutes(cutoffTime.getMinutes() - 1); // 1 minute for demo
    } else {
      cutoffTime.setHours(cutoffTime.getHours() - 24); // 24 hours for production
    }

    const eligibleTickets = await prisma.ticket.findMany({
      where: {
        status: { in: ["RESOLVED", "WAITING_CONFIRMATION"] },
        updatedAt: { lte: cutoffTime }
      }
    });

    if (eligibleTickets.length === 0) {
      return NextResponse.json({ message: "No tickets eligible for auto-closure.", count: 0 });
    }

    // 2. Perform bulk update
    await prisma.ticket.updateMany({
      where: {
        id: { in: eligibleTickets.map(t => t.id) }
      },
      data: { status: "CLOSED" }
    });

    // 3. Create status histories for all closed tickets
    for (const ticket of eligibleTickets) {
      await prisma.statusHistory.create({
        data: {
          ticketId: ticket.id,
          status: "CLOSED",
          changedBy: "SYSTEM (Auto-close API)"
        }
      });
    }

    return NextResponse.json({ 
      message: `Successfully auto-closed ${eligibleTickets.length} tickets.`,
      count: eligibleTickets.length,
      ticketIds: eligibleTickets.map(t => t.id)
    });

  } catch (error) {
    console.error("Auto-close cron error:", error);
    return NextResponse.json({ error: "Failed to run auto-close task" }, { status: 500 });
  }
}
