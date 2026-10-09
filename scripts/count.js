/* eslint-disable */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
  const assistantCount = await prisma.message.count({ where: { role: "assistant" } });
  const userCount = await prisma.message.count({ where: { role: "user" } });
  const systemCount = await prisma.message.count({ where: { role: "system" } });
  const kbCount = await prisma.knowledgeChunk.count();
  
  console.log("Message counts by role:");
  console.log(`assistant: ${assistantCount}`);
  console.log(`user: ${userCount}`);
  console.log(`system: ${systemCount}`);
  console.log(`KnowledgeChunk count: ${kbCount}`);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
