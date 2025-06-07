import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Hash passwords for test users
    const hashedPassword = await bcrypt.hash("password123", 10);
    const hashedAdminPassword = await bcrypt.hash("admin123", 10);
    const hashedDoctorPassword = await bcrypt.hash("doctor123", 10);
    const hashedEmployeePassword = await bcrypt.hash("employee123", 10); // Create users with different roles for testing (sequential to avoid deadlock)
    const user1 = await prisma.user.upsert({
        where: { username: "testuser" },
        update: {},
        create: {
            userId: "user001",
            username: "testuser",
            email: "testuser@example.com",
            fullName: "Test User",
            password: hashedPassword,
            phone: "1234567890",
            address: "123 Test St",
            role: "USER",
        },
    });

    const user2 = await prisma.user.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            userId: "admin001",
            username: "admin",
            email: "admin@petcare.com",
            fullName: "Admin User",
            password: hashedAdminPassword,
            phone: "1234567891",
            address: "456 Admin St",
            role: "ADMIN",
        },
    });

    const user3 = await prisma.user.upsert({
        where: { username: "doctor1" },
        update: {},
        create: {
            userId: "doctor001",
            username: "doctor1",
            email: "doctor1@petcare.com",
            fullName: "Dr. John Smith",
            password: hashedDoctorPassword,
            phone: "1234567892",
            address: "789 Doctor St",
            role: "DOCTOR",
        },
    });

    const user4 = await prisma.user.upsert({
        where: { username: "employee1" },
        update: {},
        create: {
            userId: "employee001",
            username: "employee1",
            email: "employee1@petcare.com",
            fullName: "Jane Employee",
            password: hashedEmployeePassword,
            phone: "1234567893",
            address: "321 Employee St",
            role: "EMPLOYEE",
        },
    });

    const users = [user1, user2, user3, user4];

    console.log("✅ Created users:", users.length);
    console.log("\n🔐 Test user credentials:");
    console.log("1. Regular User - username: testuser, password: password123");
    console.log("2. Admin - username: admin, password: admin123");
    console.log("3. Doctor - username: doctor1, password: doctor123");
    console.log("4. Employee - username: employee1, password: employee123");

    // Create pets for test users
    const pets = await Promise.all([
        prisma.pet.upsert({
            where: { petId: "pet001" },
            update: {},
            create: {
                petId: "pet001",
                name: "Buddy",
                gender: "MALE",
                species: "Dog",
                breed: "Golden Retriever",
                color: "Golden",
                ownerId: "user001",
            },
        }),
        prisma.pet.upsert({
            where: { petId: "pet002" },
            update: {},
            create: {
                petId: "pet002",
                name: "Whiskers",
                gender: "FEMALE",
                species: "Cat",
                breed: "Siamese",
                color: "Brown",
                ownerId: "user001",
            },
        }),
    ]);

    console.log("✅ Created pets:", pets.length);

    console.log("🎉 Seeding completed successfully!");
}

main()
    .then(() => {
        console.log("🎊 Database seeding was successful!");
    })
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        console.log("💤 Disconnecting Prisma client...");
        await prisma.$disconnect();
        console.log("👋 Prisma client disconnected.");
    });
