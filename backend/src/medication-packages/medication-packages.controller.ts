import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { MedicationPackagesService } from "./medication-packages.service";
import { CreateMedicationPackageDto } from "./dtos/create-medication-package.dto";
import { UpdateMedicationPackageDto } from "./dtos/update-medication-package.dto";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("medication-packages")
@UseGuards(AccessTokenGuard, RolesGuard)
export class MedicationPackagesController {
    constructor(private readonly medicationPackagesService: MedicationPackagesService) {}

    // Only DOCTOR and ADMIN can create medication packages
    @Post()
    @Roles("DOCTOR", "ADMIN")
    create(@Body() createMedicationPackageDto: CreateMedicationPackageDto) {
        return this.medicationPackagesService.create(createMedicationPackageDto);
    }

    // Only DOCTOR and ADMIN can view all medication packages
    @Get()
    @Roles("DOCTOR", "ADMIN")
    findAll() {
        return this.medicationPackagesService.findAll();
    }

    // Only DOCTOR and ADMIN can view specific medication package
    @Get(":id")
    @Roles("DOCTOR", "ADMIN")
    findOne(@Param("id") id: string) {
        return this.medicationPackagesService.findOne(id);
    }

    // Only DOCTOR and ADMIN can view packages by medicine
    @Get("medicine/:medicineId")
    @Roles("DOCTOR", "ADMIN")
    findByMedicine(@Param("medicineId") medicineId: string) {
        return this.medicationPackagesService.findByMedicine(medicineId);
    }

    // Only DOCTOR and ADMIN can update medication packages
    @Patch(":id")
    @Roles("DOCTOR", "ADMIN")
    update(@Param("id") id: string, @Body() updateMedicationPackageDto: UpdateMedicationPackageDto) {
        return this.medicationPackagesService.update(id, updateMedicationPackageDto);
    }

    // Only ADMIN can delete medication packages
    @Delete(":id")
    @Roles("ADMIN")
    remove(@Param("id") id: string) {
        return this.medicationPackagesService.remove(id);
    }
}
