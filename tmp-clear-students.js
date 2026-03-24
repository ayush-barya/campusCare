const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Dropping all student records...");
  await prisma.user.deleteMany({
    where: { role: 'STUDENT' }
  });
  console.log("Student reset complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
