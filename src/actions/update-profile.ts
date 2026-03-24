"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function updateProfile(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "STUDENT") {
      return { error: "Unauthorized access" };
    }

    const phone = formData.get("phone") as string;
    const altPhone = formData.get("altPhone") as string;
    const roomNumber = formData.get("roomNumber") as string;

    if (!phone || !roomNumber) {
      return { error: "Phone number and Room Number are required" };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        phone,
        altPhone: altPhone || null,
        roomNumber
      }
    });

    revalidatePath("/student/profile");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "An unexpected error occurred while updating your profile." };
  }
}
