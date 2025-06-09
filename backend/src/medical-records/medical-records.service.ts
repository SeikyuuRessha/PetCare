import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMedicalRecordDto } from "./dtos/create-medical-record.dto";
import { UpdateMedicalRecordDto } from "./dtos/update-medical-record.dto";
import { handleService } from "../common/utils/handleService";
import { AppException, ExceptionCode } from "../common/exception/app-exception";

@Injectable()
export class MedicalRecordsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createMedicalRecordDto: CreateMedicalRecordDto) {
        return handleService(async () => {
            // Check if doctor exists
            const doctor = await this.prisma.user.findUnique({
                where: { userId: createMedicalRecordDto.doctorId },
            });

            if (!doctor) {
                throw new AppException(ExceptionCode.USER_NOT_FOUND);
            }

            // Check if appointment exists (if provided)
            if (createMedicalRecordDto.appointmentId) {
                const appointment = await this.prisma.appointment.findUnique({
                    where: { appointmentId: createMedicalRecordDto.appointmentId },
                });

                if (!appointment) {
                    throw new AppException(ExceptionCode.APPOINTMENT_NOT_FOUND);
                }
            }
            const data = { ...createMedicalRecordDto };
            if (createMedicalRecordDto.nextCheckupDate) {
                data.nextCheckupDate = createMedicalRecordDto.nextCheckupDate;
            }

            return this.prisma.medicalRecord.create({
                data,
                include: {
                    doctor: {
                        select: {
                            userId: true,
                            fullName: true,
                            email: true,
                            phone: true,
                        },
                    },
                    appointment: {
                        include: {
                            pet: {
                                select: {
                                    petId: true,
                                    name: true,
                                    species: true,
                                    breed: true,
                                    owner: {
                                        select: {
                                            userId: true,
                                            fullName: true,
                                            phone: true,
                                            email: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    prescription: true,
                },
            });
        });
    }

    async findAll() {
        return handleService(() =>
            this.prisma.medicalRecord.findMany({
                include: {
                    doctor: {
                        select: {
                            userId: true,
                            fullName: true,
                            email: true,
                            phone: true,
                        },
                    },
                    appointment: {
                        include: {
                            pet: {
                                select: {
                                    petId: true,
                                    name: true,
                                    species: true,
                                    breed: true,
                                    owner: {
                                        select: {
                                            userId: true,
                                            fullName: true,
                                            phone: true,
                                            email: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    prescription: true,
                },
                orderBy: {
                    nextCheckupDate: "asc",
                },
            })
        );
    }

    async findOne(id: string) {
        return handleService(async () => {
            const record = await this.prisma.medicalRecord.findUnique({
                where: { recordId: id },
                include: {
                    doctor: {
                        select: {
                            userId: true,
                            fullName: true,
                            email: true,
                            phone: true,
                        },
                    },
                    appointment: {
                        include: {
                            pet: {
                                select: {
                                    petId: true,
                                    name: true,
                                    species: true,
                                    breed: true,
                                    owner: {
                                        select: {
                                            userId: true,
                                            fullName: true,
                                            phone: true,
                                            email: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    prescription: {
                        include: {
                            prescriptionDetails: {
                                include: {
                                    medicationPackage: {
                                        include: {
                                            medicine: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (!record) {
                throw new AppException(ExceptionCode.MEDICAL_RECORD_NOT_FOUND);
            }

            return record;
        });
    }

    async findByDoctor(doctorId: string) {
        return handleService(() =>
            this.prisma.medicalRecord.findMany({
                where: { doctorId },
                include: {
                    doctor: {
                        select: {
                            userId: true,
                            fullName: true,
                            email: true,
                            phone: true,
                        },
                    },
                    appointment: {
                        include: {
                            pet: {
                                select: {
                                    petId: true,
                                    name: true,
                                    species: true,
                                    breed: true,
                                    owner: {
                                        select: {
                                            userId: true,
                                            fullName: true,
                                            phone: true,
                                            email: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    nextCheckupDate: "asc",
                },
            })
        );
    }

    async update(id: string, updateMedicalRecordDto: UpdateMedicalRecordDto) {
        return handleService(async () => {
            const record = await this.prisma.medicalRecord.findUnique({
                where: { recordId: id },
            });

            if (!record) {
                throw new AppException(ExceptionCode.MEDICAL_RECORD_NOT_FOUND);
            }
            const updateData = { ...updateMedicalRecordDto };
            if (updateMedicalRecordDto.nextCheckupDate) {
                updateData.nextCheckupDate = updateMedicalRecordDto.nextCheckupDate;
            }

            return this.prisma.medicalRecord.update({
                where: { recordId: id },
                data: updateData,
                include: {
                    doctor: {
                        select: {
                            userId: true,
                            fullName: true,
                            email: true,
                            phone: true,
                        },
                    },
                    appointment: {
                        include: {
                            pet: {
                                select: {
                                    petId: true,
                                    name: true,
                                    species: true,
                                    breed: true,
                                    owner: {
                                        select: {
                                            userId: true,
                                            fullName: true,
                                            phone: true,
                                            email: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    prescription: true,
                },
            });
        });
    }

    async remove(id: string) {
        return handleService(async () => {
            const record = await this.prisma.medicalRecord.findUnique({
                where: { recordId: id },
            });

            if (!record) {
                throw new AppException(ExceptionCode.MEDICAL_RECORD_NOT_FOUND);
            }

            return this.prisma.medicalRecord.delete({
                where: { recordId: id },
            });
        });
    }
}
