import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const demoPassword = await hash("demo123", 10);

  // Clear existing data
  await prisma.message.deleteMany();
  await prisma.application.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.trial.deleteMany();
  await prisma.user.deleteMany();

  const player = await prisma.user.create({
    data: {
      email: "player@demo.com",
      name: "Sophia Carter",
      password: demoPassword,
      role: "PLAYER",
      profileData: JSON.stringify({
        firstName: "Sophia",
        lastName: "Carter",
        age: 20,
        position: "Forward",
        nationality: "United States",
        bio: "Passionate forward with 5 years of professional experience.",
        stats: { goals: 45, assists: 18, matches: 120 },
      }),
    },
  });

  const agent = await prisma.user.create({
    data: {
      email: "agent@demo.com",
      name: "Elite Football Agency",
      password: demoPassword,
      role: "AGENT",
    },
  });

  const academy = await prisma.user.create({
    data: {
      email: "academy@demo.com",
      name: "Riverdale Academy",
      password: demoPassword,
      role: "ACADEMY",
    },
  });

  // Create additional demo players
  const player2 = await prisma.user.create({
    data: {
      email: "player2@demo.com",
      name: "Alex Johnson",
      password: demoPassword,
      role: "PLAYER",
      profileData: JSON.stringify({
        firstName: "Alex",
        lastName: "Johnson",
        age: 17,
        position: "Midfielder",
        nationality: "United Kingdom",
        stats: { goals: 15, assists: 8, matches: 45 },
      }),
    },
  });

  // Create trials
  const trial1 = await prisma.trial.create({
    data: {
      title: "Elite Youth Cup",
      city: "London, UK",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  });

  const trial2 = await prisma.trial.create({
    data: {
      title: "National Academy Showcase",
      city: "Manchester, UK",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    },
  });

  const trial3 = await prisma.trial.create({
    data: {
      title: "Future Stars Tournament",
      city: "Birmingham, UK",
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    },
  });

  // Create applications
  await prisma.application.create({
    data: {
      userId: player.id,
      trialId: trial1.id,
      status: "PENDING",
    },
  });

  await prisma.application.create({
    data: {
      userId: player2.id,
      trialId: trial1.id,
      status: "ACCEPTED",
    },
  });

  // Create messages
  await prisma.message.create({
    data: {
      fromId: agent.id,
      toId: player.id,
      content: "Hi Sophia! We're interested in representing you. Can we schedule a call?",
    },
  });

  await prisma.message.create({
    data: {
      fromId: player.id,
      toId: agent.id,
      content: "Thank you! I'm very interested. When would be a good time?",
    },
  });

  // Create notifications
  await prisma.notification.create({
    data: {
      userId: player.id,
      title: "New message from an agent",
      body: "Elite Football Agency sent you a message",
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: player.id,
      title: "Application Status Update",
      body: "Your application for Elite Youth Cup has been submitted",
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: academy.id,
      title: "New Tournament Registration",
      body: "Alex Johnson registered for Elite Youth Cup",
      read: false,
    },
  });

  console.log("✅ Seeded users, trials, applications, messages, and notifications!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


