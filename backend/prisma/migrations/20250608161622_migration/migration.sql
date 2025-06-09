BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [userId] VARCHAR(50) NOT NULL,
    [username] VARCHAR(50) NOT NULL,
    [email] VARCHAR(100),
    [fullName] NVARCHAR(50) NOT NULL,
    [password] VARCHAR(255) NOT NULL,
    [refreshToken] VARCHAR(500),
    [phone] VARCHAR(20),
    [address] VARCHAR(200),
    [role] VARCHAR(10) NOT NULL CONSTRAINT [User_role_df] DEFAULT 'USER',
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([userId]),
    CONSTRAINT [User_username_key] UNIQUE NONCLUSTERED ([username]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Pet] (
    [petId] VARCHAR(50) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [gender] VARCHAR(10),
    [species] NVARCHAR(50),
    [breed] NVARCHAR(50),
    [color] NVARCHAR(50),
    [imageUrl] VARCHAR(255),
    [identifyingMarks] NVARCHAR(500),
    [ownerId] VARCHAR(50),
    CONSTRAINT [Pet_pkey] PRIMARY KEY CLUSTERED ([petId])
);

-- CreateTable
CREATE TABLE [dbo].[Appointment] (
    [appointmentId] VARCHAR(50) NOT NULL,
    [petId] VARCHAR(50) NOT NULL,
    [appointmentDate] DATETIME2 NOT NULL,
    [status] VARCHAR(10) NOT NULL CONSTRAINT [Appointment_status_df] DEFAULT 'PENDING',
    [symptoms] NVARCHAR(500),
    [createdAt] DATETIME CONSTRAINT [Appointment_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Appointment_pkey] PRIMARY KEY CLUSTERED ([appointmentId])
);

-- CreateTable
CREATE TABLE [dbo].[MedicalRecord] (
    [recordId] VARCHAR(50) NOT NULL,
    [doctorId] VARCHAR(50) NOT NULL,
    [appointmentId] VARCHAR(50),
    [diagnosis] NVARCHAR(500),
    [nextCheckupDate] DATE,
    CONSTRAINT [MedicalRecord_pkey] PRIMARY KEY CLUSTERED ([recordId]),
    CONSTRAINT [MedicalRecord_appointmentId_key] UNIQUE NONCLUSTERED ([appointmentId])
);

-- CreateTable
CREATE TABLE [dbo].[Service] (
    [serviceId] VARCHAR(50) NOT NULL,
    [serviceName] NVARCHAR(100) NOT NULL,
    [description] NVARCHAR(500),
    CONSTRAINT [Service_pkey] PRIMARY KEY CLUSTERED ([serviceId])
);

-- CreateTable
CREATE TABLE [dbo].[ServiceOption] (
    [optionId] VARCHAR(50) NOT NULL,
    [optionName] NVARCHAR(100) NOT NULL,
    [price] DECIMAL(10,2),
    [description] NVARCHAR(500),
    [serviceId] VARCHAR(50) NOT NULL,
    CONSTRAINT [ServiceOption_pkey] PRIMARY KEY CLUSTERED ([optionId])
);

-- CreateTable
CREATE TABLE [dbo].[ServiceBooking] (
    [bookingId] VARCHAR(50) NOT NULL,
    [petId] VARCHAR(50) NOT NULL,
    [serviceOptionId] VARCHAR(50) NOT NULL,
    [bookingDate] DATETIME2 NOT NULL,
    [status] VARCHAR(15) NOT NULL CONSTRAINT [ServiceBooking_status_df] DEFAULT 'PENDING',
    [specialRequirements] NVARCHAR(500),
    [createdAt] DATETIME2 CONSTRAINT [ServiceBooking_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ServiceBooking_pkey] PRIMARY KEY CLUSTERED ([bookingId])
);

-- CreateTable
CREATE TABLE [dbo].[Room] (
    [roomId] VARCHAR(50) NOT NULL,
    [roomNumber] INT NOT NULL,
    [capacity] INT NOT NULL,
    [status] VARCHAR(15) NOT NULL CONSTRAINT [Room_status_df] DEFAULT 'AVAILABLE',
    [description] NVARCHAR(500),
    [price] DECIMAL(10,2),
    CONSTRAINT [Room_pkey] PRIMARY KEY CLUSTERED ([roomId]),
    CONSTRAINT [Room_roomNumber_key] UNIQUE NONCLUSTERED ([roomNumber])
);

-- CreateTable
CREATE TABLE [dbo].[BoardingReservation] (
    [reservationId] VARCHAR(50) NOT NULL,
    [petId] VARCHAR(50) NOT NULL,
    [roomId] VARCHAR(50) NOT NULL,
    [checkInDate] DATE NOT NULL,
    [checkOutDate] DATE NOT NULL,
    [status] VARCHAR(15) NOT NULL CONSTRAINT [BoardingReservation_status_df] DEFAULT 'CONFIRMED',
    [createdAt] DATETIME CONSTRAINT [BoardingReservation_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [BoardingReservation_pkey] PRIMARY KEY CLUSTERED ([reservationId])
);

-- CreateTable
CREATE TABLE [dbo].[Notification] (
    [notificationId] VARCHAR(50) NOT NULL,
    [title] NVARCHAR(100),
    [message] NVARCHAR(1000),
    [type] VARCHAR(10) NOT NULL CONSTRAINT [Notification_type_df] DEFAULT 'INFO',
    [createdAt] DATETIME2 CONSTRAINT [Notification_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Notification_pkey] PRIMARY KEY CLUSTERED ([notificationId])
);

-- CreateTable
CREATE TABLE [dbo].[Notification_User] (
    [notificationId] VARCHAR(50) NOT NULL,
    [userId] VARCHAR(50) NOT NULL,
    CONSTRAINT [Notification_User_pkey] PRIMARY KEY CLUSTERED ([notificationId],[userId])
);

-- CreateTable
CREATE TABLE [dbo].[Medicine] (
    [medicineId] VARCHAR(50) NOT NULL,
    [name] NVARCHAR(100) NOT NULL,
    [unit] NVARCHAR(20),
    [concentration] NVARCHAR(50),
    CONSTRAINT [Medicine_pkey] PRIMARY KEY CLUSTERED ([medicineId])
);

-- CreateTable
CREATE TABLE [dbo].[MedicationPackage] (
    [packageId] VARCHAR(50) NOT NULL,
    [medicineId] VARCHAR(50) NOT NULL,
    [quantity] INT NOT NULL,
    [instruction] NVARCHAR(500),
    CONSTRAINT [MedicationPackage_pkey] PRIMARY KEY CLUSTERED ([packageId])
);

-- CreateTable
CREATE TABLE [dbo].[Prescription] (
    [prescriptionId] VARCHAR(50) NOT NULL,
    [recordId] VARCHAR(50) NOT NULL,
    CONSTRAINT [Prescription_pkey] PRIMARY KEY CLUSTERED ([prescriptionId]),
    CONSTRAINT [Prescription_recordId_key] UNIQUE NONCLUSTERED ([recordId])
);

-- CreateTable
CREATE TABLE [dbo].[PrescriptionDetail] (
    [prescriptionId] VARCHAR(50) NOT NULL,
    [packageId] VARCHAR(50) NOT NULL,
    CONSTRAINT [PrescriptionDetail_pkey] PRIMARY KEY CLUSTERED ([prescriptionId],[packageId])
);

-- CreateTable
CREATE TABLE [dbo].[Payment] (
    [paymentId] VARCHAR(50) NOT NULL,
    [userId] VARCHAR(50) NOT NULL,
    [paymentDate] DATETIME2 CONSTRAINT [Payment_paymentDate_df] DEFAULT CURRENT_TIMESTAMP,
    [totalAmount] DECIMAL(10,2),
    [status] VARCHAR(20),
    [roomBookId] VARCHAR(50),
    [serviceBookingId] VARCHAR(50),
    CONSTRAINT [Payment_pkey] PRIMARY KEY CLUSTERED ([paymentId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Pet] ADD CONSTRAINT [Pet_ownerId_fkey] FOREIGN KEY ([ownerId]) REFERENCES [dbo].[User]([userId]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Appointment] ADD CONSTRAINT [Appointment_petId_fkey] FOREIGN KEY ([petId]) REFERENCES [dbo].[Pet]([petId]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalRecord] ADD CONSTRAINT [MedicalRecord_doctorId_fkey] FOREIGN KEY ([doctorId]) REFERENCES [dbo].[User]([userId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalRecord] ADD CONSTRAINT [MedicalRecord_appointmentId_fkey] FOREIGN KEY ([appointmentId]) REFERENCES [dbo].[Appointment]([appointmentId]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ServiceOption] ADD CONSTRAINT [ServiceOption_serviceId_fkey] FOREIGN KEY ([serviceId]) REFERENCES [dbo].[Service]([serviceId]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ServiceBooking] ADD CONSTRAINT [ServiceBooking_petId_fkey] FOREIGN KEY ([petId]) REFERENCES [dbo].[Pet]([petId]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ServiceBooking] ADD CONSTRAINT [ServiceBooking_serviceOptionId_fkey] FOREIGN KEY ([serviceOptionId]) REFERENCES [dbo].[ServiceOption]([optionId]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[BoardingReservation] ADD CONSTRAINT [BoardingReservation_petId_fkey] FOREIGN KEY ([petId]) REFERENCES [dbo].[Pet]([petId]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[BoardingReservation] ADD CONSTRAINT [BoardingReservation_roomId_fkey] FOREIGN KEY ([roomId]) REFERENCES [dbo].[Room]([roomId]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Notification_User] ADD CONSTRAINT [Notification_User_notificationId_fkey] FOREIGN KEY ([notificationId]) REFERENCES [dbo].[Notification]([notificationId]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Notification_User] ADD CONSTRAINT [Notification_User_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([userId]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[MedicationPackage] ADD CONSTRAINT [MedicationPackage_medicineId_fkey] FOREIGN KEY ([medicineId]) REFERENCES [dbo].[Medicine]([medicineId]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Prescription] ADD CONSTRAINT [Prescription_recordId_fkey] FOREIGN KEY ([recordId]) REFERENCES [dbo].[MedicalRecord]([recordId]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PrescriptionDetail] ADD CONSTRAINT [PrescriptionDetail_prescriptionId_fkey] FOREIGN KEY ([prescriptionId]) REFERENCES [dbo].[Prescription]([prescriptionId]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PrescriptionDetail] ADD CONSTRAINT [PrescriptionDetail_packageId_fkey] FOREIGN KEY ([packageId]) REFERENCES [dbo].[MedicationPackage]([packageId]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Payment] ADD CONSTRAINT [Payment_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([userId]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Payment] ADD CONSTRAINT [Payment_roomBookId_fkey] FOREIGN KEY ([roomBookId]) REFERENCES [dbo].[BoardingReservation]([reservationId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Payment] ADD CONSTRAINT [Payment_serviceBookingId_fkey] FOREIGN KEY ([serviceBookingId]) REFERENCES [dbo].[ServiceBooking]([bookingId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
