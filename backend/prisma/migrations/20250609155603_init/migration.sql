-- CreateTable
CREATE TABLE `User` (
    `userId` VARCHAR(36) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NULL,
    `fullName` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `refreshToken` VARCHAR(500) NULL,
    `phone` VARCHAR(20) NULL,
    `address` VARCHAR(200) NULL,
    `role` VARCHAR(10) NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pet` (
    `petId` VARCHAR(36) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `gender` VARCHAR(10) NULL,
    `species` VARCHAR(50) NULL,
    `breed` VARCHAR(50) NULL,
    `color` VARCHAR(50) NULL,
    `imageUrl` VARCHAR(255) NULL,
    `identifyingMarks` TEXT NULL,
    `ownerId` VARCHAR(36) NULL,

    PRIMARY KEY (`petId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `appointmentId` VARCHAR(36) NOT NULL,
    `petId` VARCHAR(36) NOT NULL,
    `appointmentDate` DATETIME NOT NULL,
    `status` VARCHAR(10) NOT NULL DEFAULT 'PENDING',
    `symptoms` TEXT NULL,
    `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`appointmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MedicalRecord` (
    `recordId` VARCHAR(36) NOT NULL,
    `doctorId` VARCHAR(36) NOT NULL,
    `appointmentId` VARCHAR(36) NULL,
    `diagnosis` TEXT NULL,
    `nextCheckupDate` DATE NULL,

    UNIQUE INDEX `MedicalRecord_appointmentId_key`(`appointmentId`),
    PRIMARY KEY (`recordId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `serviceId` VARCHAR(36) NOT NULL,
    `serviceName` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`serviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceOption` (
    `optionId` VARCHAR(36) NOT NULL,
    `optionName` VARCHAR(100) NOT NULL,
    `price` DECIMAL(10, 2) NULL,
    `description` TEXT NULL,
    `serviceId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`optionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceBooking` (
    `bookingId` VARCHAR(36) NOT NULL,
    `petId` VARCHAR(36) NOT NULL,
    `serviceOptionId` VARCHAR(36) NOT NULL,
    `bookingDate` DATETIME NOT NULL,
    `status` VARCHAR(15) NOT NULL DEFAULT 'PENDING',
    `specialRequirements` TEXT NULL,
    `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`bookingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `roomId` VARCHAR(36) NOT NULL,
    `roomNumber` INTEGER NOT NULL,
    `capacity` INTEGER NOT NULL,
    `status` VARCHAR(15) NOT NULL DEFAULT 'AVAILABLE',
    `description` TEXT NULL,
    `price` DECIMAL(10, 2) NULL,

    UNIQUE INDEX `Room_roomNumber_key`(`roomNumber`),
    PRIMARY KEY (`roomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BoardingReservation` (
    `reservationId` VARCHAR(36) NOT NULL,
    `petId` VARCHAR(36) NOT NULL,
    `roomId` VARCHAR(36) NOT NULL,
    `checkInDate` DATE NOT NULL,
    `checkOutDate` DATE NOT NULL,
    `status` VARCHAR(15) NOT NULL DEFAULT 'CONFIRMED',
    `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`reservationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `notificationId` VARCHAR(36) NOT NULL,
    `title` VARCHAR(100) NULL,
    `message` TEXT NULL,
    `type` VARCHAR(10) NOT NULL DEFAULT 'INFO',
    `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`notificationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification_User` (
    `notificationId` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`notificationId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medicine` (
    `medicineId` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `unit` VARCHAR(20) NULL,
    `concentration` VARCHAR(50) NULL,

    PRIMARY KEY (`medicineId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MedicationPackage` (
    `packageId` VARCHAR(36) NOT NULL,
    `medicineId` VARCHAR(36) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `instruction` TEXT NULL,

    PRIMARY KEY (`packageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prescription` (
    `prescriptionId` VARCHAR(36) NOT NULL,
    `recordId` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `Prescription_recordId_key`(`recordId`),
    PRIMARY KEY (`prescriptionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrescriptionDetail` (
    `prescriptionId` VARCHAR(36) NOT NULL,
    `packageId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`prescriptionId`, `packageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `paymentId` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `paymentDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(3),
    `totalAmount` DECIMAL(10, 2) NULL,
    `status` VARCHAR(20) NULL,
    `roomBookId` VARCHAR(36) NULL,
    `serviceBookingId` VARCHAR(36) NULL,

    PRIMARY KEY (`paymentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pet` ADD CONSTRAINT `Pet_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `Pet`(`petId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalRecord` ADD CONSTRAINT `MedicalRecord_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `MedicalRecord` ADD CONSTRAINT `MedicalRecord_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`appointmentId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOption` ADD CONSTRAINT `ServiceOption_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`serviceId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceBooking` ADD CONSTRAINT `ServiceBooking_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `Pet`(`petId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceBooking` ADD CONSTRAINT `ServiceBooking_serviceOptionId_fkey` FOREIGN KEY (`serviceOptionId`) REFERENCES `ServiceOption`(`optionId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BoardingReservation` ADD CONSTRAINT `BoardingReservation_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `Pet`(`petId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BoardingReservation` ADD CONSTRAINT `BoardingReservation_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`roomId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification_User` ADD CONSTRAINT `Notification_User_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `Notification`(`notificationId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification_User` ADD CONSTRAINT `Notification_User_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicationPackage` ADD CONSTRAINT `MedicationPackage_medicineId_fkey` FOREIGN KEY (`medicineId`) REFERENCES `Medicine`(`medicineId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_recordId_fkey` FOREIGN KEY (`recordId`) REFERENCES `MedicalRecord`(`recordId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrescriptionDetail` ADD CONSTRAINT `PrescriptionDetail_prescriptionId_fkey` FOREIGN KEY (`prescriptionId`) REFERENCES `Prescription`(`prescriptionId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrescriptionDetail` ADD CONSTRAINT `PrescriptionDetail_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `MedicationPackage`(`packageId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_roomBookId_fkey` FOREIGN KEY (`roomBookId`) REFERENCES `BoardingReservation`(`reservationId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_serviceBookingId_fkey` FOREIGN KEY (`serviceBookingId`) REFERENCES `ServiceBooking`(`bookingId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
