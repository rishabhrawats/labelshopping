import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function ensureOrderStatusValue(value: string) {
  const existing = await prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
    `SELECT EXISTS (
      SELECT 1
      FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'OrderStatus' AND e.enumlabel = $1
    ) AS "exists"`,
    value
  );

  if (!existing[0]?.exists) {
    await prisma.$executeRawUnsafe(`ALTER TYPE "OrderStatus" ADD VALUE '${value}'`);
    console.log(`Added enum value OrderStatus.${value}`);
  }
}

async function main() {
  await ensureOrderStatusValue("CONFIRMED");
  await ensureOrderStatusValue("PROCESSING");
  await ensureOrderStatusValue("PAYMENT_FAILED");

  await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "requestId" TEXT`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentFailureReason" TEXT`);

  await prisma.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS "Order_requestId_key" ON "Order"("requestId") WHERE "requestId" IS NOT NULL`
  );

  console.log("Supabase schema sync complete.");
}

main()
  .catch((error) => {
    console.error("Supabase schema sync failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
