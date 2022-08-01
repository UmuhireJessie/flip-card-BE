import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const newCard = await prisma.card.create({
    data: {
      question: "What is ICT in full?",
      answer: "Information Communication Technology",
    },
  });
  await prisma.card.create({
    data: {
      question: "What is IT in full?",
      answer: "Information Technology",
    },
  });
  const allCards = await prisma.card.findMany();
  console.log(allCards);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
