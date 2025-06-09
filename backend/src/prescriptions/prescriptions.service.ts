import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePrescriptionDto } from "./dtos/create-prescription.dto";
import { UpdatePrescriptionDto } from "./dtos/update-prescription.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exceptions/app.exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class PrescriptionsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createPrescriptionDto: CreatePrescriptionDto) {
        return handleService(async () => {
            // Check if medical record exists
            const medicalRecord = await this.prisma.medicalRecord.findUnique({
                where: { recordId: createPrescriptionDto.recordId },
            });

            if (!medicalRecord) {
                throw new AppException(ExceptionCode.MEDICAL_RECORD_NOT_FOUND);
            }

            // Check if prescription already exists for this medical record
            const existingPrescription = await this.prisma.prescription.findUnique({
                where: { recordId: createPrescriptionDto.recordId },
            });

            if (existingPrescription) {
                throw new AppException(ExceptionCode.PRESCRIPTION_ALREADY_EXISTS);
            }

            return this.prisma.prescription.create({
                data: createPrescriptionDto,
                include: {
                    medicalRecord: {
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
                    },
                    prescriptionDetails: {
                        include: {
                            medicationPackage: {
                                include: {
                                    medicine: {
                                        select: {
                                            medicineId: true,
                                            name: true,
                                            unit: true,
                                            concentration: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
        });
    }

    async findAll() {
        return handleService(() =>
            this.prisma.prescription.findMany({
                include: {
                    medicalRecord: {
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
                    },
                    prescriptionDetails: {
                        include: {
                            medicationPackage: {
                                include: {
                                    medicine: {
                                        select: {
                                            medicineId: true,
                                            name: true,
                                            unit: true,
                                            concentration: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    medicalRecord: {
                        appointment: {
                            appointmentDate: "desc",
                        },
                    },
                },
            })
        );
    }

    async findOne(id: string) {
        return handleService(async () => {
            const prescription = await this.prisma.prescription.findUnique({
                where: { prescriptionId: id },
                include: {
                    medicalRecord: {
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
                    },
                    prescriptionDetails: {
                        include: {
                            medicationPackage: {
                                include: {
                                    medicine: {
                                        select: {
                                            medicineId: true,
                                            name: true,
                                            unit: true,
                                            concentration: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (!prescription) {
                throw new AppException(ExceptionCode.PRESCRIPTION_NOT_FOUND);
            }

            return prescription;
        });
    }

    async findByMedicalRecord(recordId: string) {
        return handleService(() =>
            this.prisma.prescription.findUnique({
                where: { recordId },
                include: {
                    medicalRecord: {
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
                    },
                    prescriptionDetails: {
                        include: {
                            medicationPackage: {
                                include: {
                                    medicine: {
                                        select: {
                                            medicineId: true,
                                            name: true,
                                            unit: true,
                                            concentration: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            })
        );
    }

    async findByDoctor(doctorId: string) {
        return handleService(() =>
            this.prisma.prescription.findMany({
                where: {
                    medicalRecord: {
                        doctorId: doctorId,
                    },
                },
                include: {
                    medicalRecord: {
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
                    },
                    prescriptionDetails: {
                        include: {
                            medicationPackage: {
                                include: {
                                    medicine: {
                                        select: {
                                            medicineId: true,
                                            name: true,
                                            unit: true,
                                            concentration: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    medicalRecord: {
                        appointment: {
                            appointmentDate: "desc",
                        },
                    },
                },
            })
        );
    }

    async update(id: string, updatePrescriptionDto: UpdatePrescriptionDto) {
        return handleService(async () => {
            const prescription = await this.prisma.prescription.findUnique({
                where: { prescriptionId: id },
            });

            if (!prescription) {
                throw new AppException(ExceptionCode.PRESCRIPTION_NOT_FOUND);
            }

            // If recordId is being updated, check if the new medical record exists
            if (updatePrescriptionDto.recordId) {
                const medicalRecord = await this.prisma.medicalRecord.findUnique({
                    where: { recordId: updatePrescriptionDto.recordId },
                });

                if (!medicalRecord) {
                    throw new AppException(ExceptionCode.MEDICAL_RECORD_NOT_FOUND);
                }

                // Check if another prescription already exists for the new medical record
                const existingPrescription = await this.prisma.prescription.findUnique({
                    where: { recordId: updatePrescriptionDto.recordId },
                });

                if (existingPrescription && existingPrescription.prescriptionId !== id) {
                    throw new AppException(ExceptionCode.PRESCRIPTION_ALREADY_EXISTS);
                }
            }

            return this.prisma.prescription.update({
                where: { prescriptionId: id },
                data: updatePrescriptionDto,
                include: {
                    medicalRecord: {
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
                    },
                    prescriptionDetails: {
                        include: {
                            medicationPackage: {
                                include: {
                                    medicine: {
                                        select: {
                                            medicineId: true,
                                            name: true,
                                            unit: true,
                                            concentration: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
        });
    }

    async remove(id: string) {
        return handleService(async () => {
            const prescription = await this.prisma.prescription.findUnique({
                where: { prescriptionId: id },
            });

            if (!prescription) {
                throw new AppException(ExceptionCode.PRESCRIPTION_NOT_FOUND);
            }

            return this.prisma.prescription.delete({
                where: { prescriptionId: id },
            });
        });
    }
}
