import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { MedicinesService } from "./medicines.service";
import { CreateMedicineDto } from "./dtos/create-medicine.dto";
import { UpdateMedicineDto } from "./dtos/update-medicine.dto";

@Controller("medicines")
export class MedicinesController {
    constructor(private readonly medicinesService: MedicinesService) {}

    @Post()
    create(@Body() createMedicineDto: CreateMedicineDto) {
        return this.medicinesService.create(createMedicineDto);
    }

    @Get()
    findAll(@Query("search") search?: string) {
        if (search) {
            return this.medicinesService.search(search);
        }
        return this.medicinesService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.medicinesService.findOne(id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateMedicineDto: UpdateMedicineDto) {
        return this.medicinesService.update(id, updateMedicineDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.medicinesService.remove(id);
    }
}
