import { PrismaClient } from '../generated/prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';
import { PrismaPg } from '@prisma/adapter-pg';

// Setup
const connectionString = `${process.env.DATABASE_URL}`

// Init Prisma Client with adapter
	const adapter = new PrismaPg({ 
																								connectionString: process.env.DATABASE_URL as string,
																});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding inventory from XLS...');

  const filePath = path.join(__dirname, '../data/inventory.xlsx');

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<any>(sheet);

  const data = rows.map((row) => ({
    id: row.id,
    sku: row.sku,
    productName: row.productName,
    quantity: Number(row.quantity),
    reserved: Number(row.reserved ?? 0),
    createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
    updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
  }));

  await prisma.inventory.createMany({
    data,
    skipDuplicates: true, // important for re-runs
  });

  console.log(`✅ Seeded ${data.length} inventory records`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

