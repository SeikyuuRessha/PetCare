import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { MedicalRecordsService } from "./medical-records.service";
import { CreateMedicalRecordDto } from "./dtos/create-medical-record.dto";
import { UpdateMedicalRecordDto } from "./dtos/update-medical-record.dto";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("medical-records")
@UseGuards(AccessTokenGuard, RolesGuard)
export class MedicalRecordsController {
    constructor(private readonly medicalRecordsService: MedicalRecordsService) {} // DOCTOR, ADMIN and EMPLOYEE can create medical records
    @Post()
    @Roles("DOCTOR", "ADMIN", "EMPLOYEE")
    create(@Body() createMedicalRecordDto: CreateMedicalRecordDto) {
        return this.medicalRecordsService.create(createMedicalRecordDto);
    } // DOCTOR, ADMIN and EMPLOYEE can view all medical records
    @Get()
    @Roles("DOCTOR", "ADMIN", "EMPLOYEE")
    findAll() {
        return this.medicalRecordsService.findAll();
    }

    // Only DOCTOR and ADMIN can view specific medical record
    @Get(":id")
    @Roles("DOCTOR", "ADMIN")
    findOne(@Param("id") id: string) {
        return this.medicalRecordsService.findOne(id);
    }

    // Only DOCTOR and ADMIN can search medical records by doctor
    @Get("doctor/:doctorId")
    @Roles("DOCTOR", "ADMIN")
    findByDoctor(@Param("doctorId") doctorId: string) {
        return this.medicalRecordsService.findByDoctor(doctorId);
    } // DOCTOR, ADMIN and EMPLOYEE can update medical records
    @Patch(":id")
    @Roles("DOCTOR", "ADMIN", "EMPLOYEE")
    update(@Param("id") id: string, @Body() updateMedicalRecordDto: UpdateMedicalRecordDto) {
        return this.medicalRecordsService.update(id, updateMedicalRecordDto);
    }

    // Only ADMIN can delete medical records
    @Delete(":id")
    @Roles("ADMIN")
    remove(@Param("id") id: string) {
        return this.medicalRecordsService.remove(id);
    }
}
