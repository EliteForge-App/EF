import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { SYSTEM_ROLES_SEED } from '../libs/common/src/constants/roles';

async function main(): Promise<void> {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    for (const role of SYSTEM_ROLES_SEED) {
      await prisma.role.upsert({
        where: { name: role.name },
        update: { description: role.description },
        create: {
          name: role.name,
          description: role.description,
        },
      });
    }

    console.log(`Seed completado: ${SYSTEM_ROLES_SEED.length} roles del sistema.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error('Error ejecutando seed:', error);
  process.exit(1);
});
