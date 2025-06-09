import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMedicationPackageDto } from "./dtos/create-medication-package.dto";
import { UpdateMedicationPackageDto } from "./dtos/update-medication-package.dto";
import { handleService } from "../common/utils/handleService";
import { AppException } from "../common/exceptions/app.exception";
import { ExceptionCode } from "../common/exception/exception-code";

@Injectable()
export class MedicationPackagesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createMedicationPackageDto: CreateMedicationPackageDto) {
        return handleService(async () => {
            // Check if medicine exists
            const medicine = await this.prisma.medicine.findUnique({
                where: { medicineId: createMedicationPackageDto.medicineId },
            });

            if (!medicine) {
                throw new AppException(ExceptionCode.MEDICINE_NOT_FOUND);
            }

            return this.prisma.medicationPackage.create({
                data: createMedicationPackageDto,
                include: {
                    medicine: {
                        select: {
                            medicineId: true,
                            name: true,
                            unit: true,
                            concentration: true,
                        },
                    },
                    prescriptionDetails: {
                        include: {
                            prescription: {
                                include: {
                                    medicalRecord: {
                                        include: {
                                            doctor: {
                                                select: {
                                                    userId: true,
                                                    fullName: true,
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
                },
            });
        });
    }

    async findAll() {
        return handleService(() =>
            this.prisma.medicationPackage.findMany({
                include: {
                    medicine: {
                        select: {
                            medicineId: true,
                            name: true,
                            unit: true,
                            concentration: true,
                        },
                    },
                    prescriptionDetails: {
                        include: {
                            prescription: {
                                include: {
                                    medicalRecord: {
                                        include: {
                                            doctor: {
                                                select: {
                                                    userId: true,
                                                    fullName: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    quantity: "desc",
                },
            })
        );
    }

    async findOne(id: string) {
        return handleService(async () => {
            const medicationPackage = await this.prisma.medicationPackage.findUnique({
                where: { packageId: id },
                include: {
                    medicine: {
                        select: {
                            medicineId: true,
                            name: true,
                            unit: true,
                            concentration: true,
                        },
                    },
                    prescriptionDetails: {
                        include: {
                            prescription: {
                                include: {
                                    medicalRecord: {
                                        include: {
                                            doctor: {
                                                select: {
                                                    userId: true,
                                                    fullName: true,
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
                },
            });

            if (!medicationPackage) {
                throw new AppException(ExceptionCode.MEDICATION_PACKAGE_NOT_FOUND);
            }

            return medicationPackage;
        });
    }

    async findByMedicine(medicineId: string) {
        return handleService(() =>
            this.prisma.medicationPackage.findMany({
                where: { medicineId },
                include: {
                    medicine: {
                        select: {
                            medicineId: true,
                            name: true,
                            unit: true,
                            concentration: true,
                        },
                    },
                    prescriptionDetails: {
                        include: {
                            prescription: {
                                include: {
                                    medicalRecord: {
                                        include: {
                                            doctor: {
                                                select: {
                                                    userId: true,
                                                    fullName: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    quantity: "desc",
                },
            })
        );
    }

    async update(id: string, updateMedicationPackageDto: UpdateMedicationPackageDto) {
        return handleService(async () => {
            const medicationPackage = await this.prisma.medicationPackage.findUnique({
                where: { packageId: id },
            });

            if (!medicationPackage) {
                throw new AppException(ExceptionCode.MEDICATION_PACKAGE_NOT_FOUND);
            }

            // If medicineId is being updated, check if the new medicine exists
            if (updateMedicationPackageDto.medicineId) {
                const medicine = await this.prisma.medicine.findUnique({
                    where: { medicineId: updateMedicationPackageDto.medicineId },
                });

                if (!medicine) {
                    throw new AppException(ExceptionCode.MEDICINE_NOT_FOUND);
                }
            }

            return this.prisma.medicationPackage.update({
                where: { packageId: id },
                data: updateMedicationPackageDto,
                include: {
                    medicine: {
                        select: {
                            medicineId: true,
                            name: true,
                            unit: true,
                            concentration: true,
                        },
                    },
                    prescriptionDetails: {
                        include: {
                            prescription: {
                                include: {
                                    medicalRecord: {
                                        include: {
                                            doctor: {
                                                select: {
                                                    userId: true,
                                                    fullName: true,
                                                },
                                            },
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
            const medicationPackage = await this.prisma.medicationPackage.findUnique({
                where: { packageId: id },
            });

            if (!medicationPackage) {
                throw new AppException(ExceptionCode.MEDICATION_PACKAGE_NOT_FOUND);
            }

            return this.prisma.medicationPackage.delete({
                where: { packageId: id },
            });
        });
    }
}
