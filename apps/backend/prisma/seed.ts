import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { SYSTEM_ROLE_NAMES, SYSTEM_ROLES_SEED } from '../libs/common/src/constants/roles';

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

    const empresarioRole = await prisma.role.findUniqueOrThrow({
      where: { name: SYSTEM_ROLE_NAMES.EMPRESARIO },
    });

    const jugadorRole = await prisma.role.findUniqueOrThrow({
      where: { name: SYSTEM_ROLE_NAMES.JUGADOR },
    });

    const adminEmail = 'admin@eliteforge.com';
    const adminPassword = 'Admin123!';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        firstname: 'Admin',
        lastname: 'Cancha',
        passwordHash,
        roleId: empresarioRole.id,
      },
      create: {
        email: adminEmail,
        firstname: 'Admin',
        lastname: 'Cancha',
        passwordHash,
        roleId: empresarioRole.id,
      },
    });

    await prisma.profile.upsert({
      where: { userId: adminUser.id },
      update: { alias: 'admin_cancha' },
      create: {
        userId: adminUser.id,
        alias: 'admin_cancha',
      },
    });

    const demoVenue = await prisma.venue.upsert({
      where: { id: '00000000-0000-4000-8000-000000000001' },
      update: {
        name: 'Cancha Elite Demo',
        address: 'Av. Principal 123',
        pricePerHourCents: 4500,
        ownerId: adminUser.id,
      },
      create: {
        id: '00000000-0000-4000-8000-000000000001',
        ownerId: adminUser.id,
        name: 'Cancha Elite Demo',
        address: 'Av. Principal 123',
        pricePerHourCents: 4500,
      },
    });

    const demoPlayer = await prisma.user.upsert({
      where: { email: 'jugador.demo@eliteforge.com' },
      update: {
        firstname: 'Juan',
        lastname: 'Demo',
        roleId: jugadorRole.id,
      },
      create: {
        email: 'jugador.demo@eliteforge.com',
        firstname: 'Juan',
        lastname: 'Demo',
        passwordHash: await bcrypt.hash('Demo123!', 10),
        roleId: jugadorRole.id,
      },
    });

    await prisma.profile.upsert({
      where: { userId: demoPlayer.id },
      update: { alias: 'juan_demo' },
      create: {
        userId: demoPlayer.id,
        alias: 'juan_demo',
      },
    });

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 0, 0, 0);
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(19, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);
    const dayAfterEnd = new Date(dayAfter);
    dayAfterEnd.setHours(20, 0, 0, 0);

    await prisma.reservation.upsert({
      where: { id: '00000000-0000-4000-8000-000000000101' },
      update: {
        venueId: demoVenue.id,
        venueName: demoVenue.name,
        startsAt: tomorrow,
        endsAt: tomorrowEnd,
        status: 'pending',
      },
      create: {
        id: '00000000-0000-4000-8000-000000000101',
        userId: demoPlayer.id,
        venueId: demoVenue.id,
        venueName: demoVenue.name,
        startsAt: tomorrow,
        endsAt: tomorrowEnd,
        status: 'pending',
        notes: 'Reserva demo pendiente',
      },
    });

    await prisma.reservation.upsert({
      where: { id: '00000000-0000-4000-8000-000000000102' },
      update: {
        venueId: demoVenue.id,
        venueName: demoVenue.name,
        startsAt: dayAfter,
        endsAt: dayAfterEnd,
        status: 'confirmed',
      },
      create: {
        id: '00000000-0000-4000-8000-000000000102',
        userId: demoPlayer.id,
        venueId: demoVenue.id,
        venueName: demoVenue.name,
        startsAt: dayAfter,
        endsAt: dayAfterEnd,
        status: 'confirmed',
      },
    });

    console.log(`Seed completado: ${SYSTEM_ROLES_SEED.length} roles del sistema.`);
    console.log(`Admin demo: ${adminEmail} / ${adminPassword}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error('Error ejecutando seed:', error);
  process.exit(1);
});
