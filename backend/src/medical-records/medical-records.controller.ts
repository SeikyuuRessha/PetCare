import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { MedicalRecordsService } from "./medical-records.service";
import { CreateMedicalRecordDto } from "./dtos/create-medical-record.dto";
import { UpdateMedicalRecordDto } from "./dtos/update-medical-record.dto";

@Controller("medical-records")
export class MedicalRecordsController {
    constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

    @Post()
    create(@Body() createMedicalRecordDto: CreateMedicalRecordDto) {
        return this.medicalRecordsService.create(createMedicalRecordDto);
    }

    @Get()
    findAll() {
        return this.medicalRecordsService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.medicalRecordsService.findOne(id);
    }

    @Get("doctor/:doctorId")
    findByDoctor(@Param("doctorId") doctorId: string) {
        return this.medicalRecordsService.findByDoctor(doctorId);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateMedicalRecordDto: UpdateMedicalRecordDto) {
        return this.medicalRecordsService.update(id, updateMedicalRecordDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.medicalRecordsService.remove(id);
    }
}
