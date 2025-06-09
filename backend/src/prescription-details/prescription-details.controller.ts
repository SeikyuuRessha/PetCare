import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { PrescriptionDetailsService } from "./prescription-details.service";
import { CreatePrescriptionDetailDto } from "./dtos/create-prescription-detail.dto";

@Controller("prescription-details")
export class PrescriptionDetailsController {
    constructor(private readonly prescriptionDetailsService: PrescriptionDetailsService) {}

    @Post()
    create(@Body() createPrescriptionDetailDto: CreatePrescriptionDetailDto) {
        return this.prescriptionDetailsService.create(createPrescriptionDetailDto);
    }

    @Get()
    findAll() {
        return this.prescriptionDetailsService.findAll();
    }

    @Get("prescription/:prescriptionId")
    findByPrescription(@Param("prescriptionId") prescriptionId: string) {
        return this.prescriptionDetailsService.findByPrescription(prescriptionId);
    }

    @Get("medication-package/:packageId")
    findByMedicationPackage(@Param("packageId") packageId: string) {
        return this.prescriptionDetailsService.findByMedicationPackage(packageId);
    }

    @Get(":prescriptionId/:packageId")
    findOne(@Param("prescriptionId") prescriptionId: string, @Param("packageId") packageId: string) {
        return this.prescriptionDetailsService.findOne(prescriptionId, packageId);
    }

    @Delete(":prescriptionId/:packageId")
    remove(@Param("prescriptionId") prescriptionId: string, @Param("packageId") packageId: string) {
        return this.prescriptionDetailsService.remove(prescriptionId, packageId);
    }
}
