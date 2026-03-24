const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Dropping all database records...");
  await prisma.assignment.deleteMany({});
  await prisma.statusHistory.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.user.deleteMany({});
  
  // Create default categories since they are needed for tickets
  console.log("Re-seeding Categories...");
  const categories = ['Electricity', 'Plumbing', 'Carpentry', 'IT', 'Other'];
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat },
      update: {},
      create: { name: cat }
    });
  }

  console.log("Database reset complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
