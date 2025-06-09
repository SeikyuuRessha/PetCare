import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { PrescriptionsService } from "./prescriptions.service";
import { CreatePrescriptionDto } from "./dtos/create-prescription.dto";
import { UpdatePrescriptionDto } from "./dtos/update-prescription.dto";

@Controller("prescriptions")
export class PrescriptionsController {
    constructor(private readonly prescriptionsService: PrescriptionsService) {}

    @Post()
    create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
        return this.prescriptionsService.create(createPrescriptionDto);
    }

    @Get()
    findAll() {
        return this.prescriptionsService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.prescriptionsService.findOne(id);
    }

    @Get("medical-record/:recordId")
    findByMedicalRecord(@Param("recordId") recordId: string) {
        return this.prescriptionsService.findByMedicalRecord(recordId);
    }

    @Get("doctor/:doctorId")
    findByDoctor(@Param("doctorId") doctorId: string) {
        return this.prescriptionsService.findByDoctor(doctorId);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updatePrescriptionDto: UpdatePrescriptionDto) {
        return this.prescriptionsService.update(id, updatePrescriptionDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.prescriptionsService.remove(id);
    }
}
