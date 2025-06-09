import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { PrescriptionsService } from "./prescriptions.service";
import { CreatePrescriptionDto } from "./dtos/create-prescription.dto";
import { UpdatePrescriptionDto } from "./dtos/update-prescription.dto";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("prescriptions")
@UseGuards(AccessTokenGuard, RolesGuard)
export class PrescriptionsController {
    constructor(private readonly prescriptionsService: PrescriptionsService) {}

    // Only DOCTOR and ADMIN can create prescriptions
    @Post()
    @Roles("DOCTOR", "ADMIN")
    create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
        return this.prescriptionsService.create(createPrescriptionDto);
    }

    // Only DOCTOR and ADMIN can view all prescriptions
    @Get()
    @Roles("DOCTOR", "ADMIN")
    findAll() {
        return this.prescriptionsService.findAll();
    }

    // Only DOCTOR and ADMIN can view specific prescription
    @Get(":id")
    @Roles("DOCTOR", "ADMIN")
    findOne(@Param("id") id: string) {
        return this.prescriptionsService.findOne(id);
    }

    // Only DOCTOR and ADMIN can view prescriptions by medical record
    @Get("medical-record/:recordId")
    @Roles("DOCTOR", "ADMIN")
    findByMedicalRecord(@Param("recordId") recordId: string) {
        return this.prescriptionsService.findByMedicalRecord(recordId);
    }

    // Only DOCTOR and ADMIN can view prescriptions by doctor
    @Get("doctor/:doctorId")
    @Roles("DOCTOR", "ADMIN")
    findByDoctor(@Param("doctorId") doctorId: string) {
        return this.prescriptionsService.findByDoctor(doctorId);
    }

    // Only DOCTOR and ADMIN can update prescriptions
    @Patch(":id")
    @Roles("DOCTOR", "ADMIN")
    update(@Param("id") id: string, @Body() updatePrescriptionDto: UpdatePrescriptionDto) {
        return this.prescriptionsService.update(id, updatePrescriptionDto);
    }

    // Only ADMIN can delete prescriptions
    @Delete(":id")
    @Roles("ADMIN")
    remove(@Param("id") id: string) {
        return this.prescriptionsService.remove(id);
    }
}
