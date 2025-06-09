import { Controller, Get, Post, Body, Param, Delete, UseGuards } from "@nestjs/common";
import { PrescriptionDetailsService } from "./prescription-details.service";
import { CreatePrescriptionDetailDto } from "./dtos/create-prescription-detail.dto";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("prescription-details")
@UseGuards(AccessTokenGuard, RolesGuard)
export class PrescriptionDetailsController {
    constructor(private readonly prescriptionDetailsService: PrescriptionDetailsService) {}

    // Only DOCTOR and ADMIN can create prescription details
    @Post()
    @Roles("DOCTOR", "ADMIN")
    create(@Body() createPrescriptionDetailDto: CreatePrescriptionDetailDto) {
        return this.prescriptionDetailsService.create(createPrescriptionDetailDto);
    }

    // Only DOCTOR and ADMIN can view all prescription details
    @Get()
    @Roles("DOCTOR", "ADMIN")
    findAll() {
        return this.prescriptionDetailsService.findAll();
    }

    // Only DOCTOR and ADMIN can view prescription details by prescription
    @Get("prescription/:prescriptionId")
    @Roles("DOCTOR", "ADMIN")
    findByPrescription(@Param("prescriptionId") prescriptionId: string) {
        return this.prescriptionDetailsService.findByPrescription(prescriptionId);
    }

    // Only DOCTOR and ADMIN can view prescription details by medication package
    @Get("medication-package/:packageId")
    @Roles("DOCTOR", "ADMIN")
    findByMedicationPackage(@Param("packageId") packageId: string) {
        return this.prescriptionDetailsService.findByMedicationPackage(packageId);
    }

    // Only DOCTOR and ADMIN can view specific prescription detail
    @Get(":prescriptionId/:packageId")
    @Roles("DOCTOR", "ADMIN")
    findOne(@Param("prescriptionId") prescriptionId: string, @Param("packageId") packageId: string) {
        return this.prescriptionDetailsService.findOne(prescriptionId, packageId);
    }

    // Only ADMIN can delete prescription details
    @Delete(":prescriptionId/:packageId")
    @Roles("ADMIN")
    remove(@Param("prescriptionId") prescriptionId: string, @Param("packageId") packageId: string) {
        return this.prescriptionDetailsService.remove(prescriptionId, packageId);
    }
}
