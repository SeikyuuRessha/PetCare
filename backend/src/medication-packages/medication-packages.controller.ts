import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { MedicationPackagesService } from "./medication-packages.service";
import { CreateMedicationPackageDto } from "./dtos/create-medication-package.dto";
import { UpdateMedicationPackageDto } from "./dtos/update-medication-package.dto";

@Controller("medication-packages")
export class MedicationPackagesController {
    constructor(private readonly medicationPackagesService: MedicationPackagesService) {}

    @Post()
    create(@Body() createMedicationPackageDto: CreateMedicationPackageDto) {
        return this.medicationPackagesService.create(createMedicationPackageDto);
    }

    @Get()
    findAll() {
        return this.medicationPackagesService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.medicationPackagesService.findOne(id);
    }

    @Get("medicine/:medicineId")
    findByMedicine(@Param("medicineId") medicineId: string) {
        return this.medicationPackagesService.findByMedicine(medicineId);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateMedicationPackageDto: UpdateMedicationPackageDto) {
        return this.medicationPackagesService.update(id, updateMedicationPackageDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.medicationPackagesService.remove(id);
    }
}
