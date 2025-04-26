import { prismaClient } from "../../../packages/db";

export const incrementUsage = async (
  userId: string,
  field: "responsesUsed" | "botCount" | "sourcesCount",
  amount = 1
) => {
  console.log("BOT UPDATE HIT");
  await prismaClient.userUsage.upsert({
    where: { userId },
    update: { [field]: { increment: amount } },
    create: {
      userId,
      responsesUsed: field === "responsesUsed" ? amount : 0,
      botCount: field === "botCount" ? amount : 0,
      sourcesCount: field === "sourcesCount" ? amount : 0,
    },
  });
};