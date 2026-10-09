/* eslint-disable */
/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === "production") {
    console.error("This script should not be run in production.");
    process.exit(1);
  }
  
  console.log("Deleting RateLimitRequest rows...");
  const result = await prisma.rateLimitRequest.deleteMany({});
  console.log(`Deleted ${result.count} rows.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
