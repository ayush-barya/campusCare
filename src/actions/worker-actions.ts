"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function addWorker(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const department = formData.get("department") as string;

  if (!name || !phone || !department) {
    return { error: "Name, Phone, and Department are required." };
  }

  try {
    const existing = await prisma.worker.findUnique({ where: { phone } });
    if (existing) {
      return { error: "A worker with this phone number already exists." };
    }

    await prisma.worker.create({
      data: { name, phone, department }
    });

    revalidatePath("/admin/workers");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to add worker." };
  }
}

export async function removeWorker(formData: FormData) {
  const workerId = formData.get("workerId") as string;
  try {
    await prisma.worker.delete({
      where: { id: workerId }
    });

    revalidatePath("/admin/workers");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to remove worker. They might be assigned to a ticket." };
  }
}
