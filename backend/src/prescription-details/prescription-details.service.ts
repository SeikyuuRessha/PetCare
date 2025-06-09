import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePrescriptionDetailDto } from "./dtos/create-prescription-detail.dto";
import { UpdatePrescriptionDetailDto } from "./dtos/update-prescription-detail.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exceptions/app.exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class PrescriptionDetailsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createPrescriptionDetailDto: CreatePrescriptionDetailDto) {
        return handleService(async () => {
            // Check if prescription exists
            const prescription = await this.prisma.prescription.findUnique({
                where: { prescriptionId: createPrescriptionDetailDto.prescriptionId },
            });

            if (!prescription) {
                throw new AppException(ExceptionCode.PRESCRIPTION_NOT_FOUND);
            }

            // Check if medication package exists
            const medicationPackage = await this.prisma.medicationPackage.findUnique({
                where: { packageId: createPrescriptionDetailDto.packageId },
            });

            if (!medicationPackage) {
                throw new AppException(ExceptionCode.MEDICATION_PACKAGE_NOT_FOUND);
            }

            // Check if this combination already exists
            const existingDetail = await this.prisma.prescriptionDetail.findUnique({
                where: {
                    prescriptionId_packageId: {
                        prescriptionId: createPrescriptionDetailDto.prescriptionId,
                        packageId: createPrescriptionDetailDto.packageId,
                    },
                },
            });

            if (existingDetail) {
                throw new AppException(ExceptionCode.PRESCRIPTION_DETAIL_ALREADY_EXISTS);
            }

            return this.prisma.prescriptionDetail.create({
                data: createPrescriptionDetailDto,
                include: {
                    prescription: {
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
                        },
                    },
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
            });
        });
    }

    async findAll() {
        return handleService(() =>
            this.prisma.prescriptionDetail.findMany({
                include: {
                    prescription: {
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
                        },
                    },
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
                orderBy: [
                    {
                        prescription: {
                            medicalRecord: {
                                appointment: {
                                    appointmentDate: "desc",
                                },
                            },
                        },
                    },
                    {
                        medicationPackage: {
                            medicine: {
                                name: "asc",
                            },
                        },
                    },
                ],
            })
        );
    }

    async findByPrescription(prescriptionId: string) {
        return handleService(() =>
            this.prisma.prescriptionDetail.findMany({
                where: { prescriptionId },
                include: {
                    prescription: {
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
                        },
                    },
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
                orderBy: {
                    medicationPackage: {
                        medicine: {
                            name: "asc",
                        },
                    },
                },
            })
        );
    }

    async findByMedicationPackage(packageId: string) {
        return handleService(() =>
            this.prisma.prescriptionDetail.findMany({
                where: { packageId },
                include: {
                    prescription: {
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
                        },
                    },
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
                orderBy: {
                    prescription: {
                        medicalRecord: {
                            appointment: {
                                appointmentDate: "desc",
                            },
                        },
                    },
                },
            })
        );
    }

    async findOne(prescriptionId: string, packageId: string) {
        return handleService(async () => {
            const prescriptionDetail = await this.prisma.prescriptionDetail.findUnique({
                where: {
                    prescriptionId_packageId: {
                        prescriptionId,
                        packageId,
                    },
                },
                include: {
                    prescription: {
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
                        },
                    },
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
            });

            if (!prescriptionDetail) {
                throw new AppException(ExceptionCode.PRESCRIPTION_DETAIL_NOT_FOUND);
            }

            return prescriptionDetail;
        });
    }

    async remove(prescriptionId: string, packageId: string) {
        return handleService(async () => {
            const prescriptionDetail = await this.prisma.prescriptionDetail.findUnique({
                where: {
                    prescriptionId_packageId: {
                        prescriptionId,
                        packageId,
                    },
                },
            });

            if (!prescriptionDetail) {
                throw new AppException(ExceptionCode.PRESCRIPTION_DETAIL_NOT_FOUND);
            }

            return this.prisma.prescriptionDetail.delete({
                where: {
                    prescriptionId_packageId: {
                        prescriptionId,
                        packageId,
                    },
                },
            });
        });
    }
}
