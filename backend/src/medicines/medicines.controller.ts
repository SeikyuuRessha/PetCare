import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from "@nestjs/common";
import { MedicinesService } from "./medicines.service";
import { CreateMedicineDto } from "./dtos/create-medicine.dto";
import { UpdateMedicineDto } from "./dtos/update-medicine.dto";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("medicines")
@UseGuards(AccessTokenGuard, RolesGuard)
export class MedicinesController {
    constructor(private readonly medicinesService: MedicinesService) {}

    // Only DOCTOR and ADMIN can create medicines
    @Post()
    @Roles("DOCTOR", "ADMIN")
    create(@Body() createMedicineDto: CreateMedicineDto) {
        return this.medicinesService.create(createMedicineDto);
    }

    // Only DOCTOR and ADMIN can view all medicines and search
    @Get()
    @Roles("DOCTOR", "ADMIN")
    findAll(@Query("search") search?: string) {
        if (search) {
            return this.medicinesService.search(search);
        }
        return this.medicinesService.findAll();
    }

    // Only DOCTOR and ADMIN can view specific medicine
    @Get(":id")
    @Roles("DOCTOR", "ADMIN")
    findOne(@Param("id") id: string) {
        return this.medicinesService.findOne(id);
    }

    // Only DOCTOR and ADMIN can update medicines
    @Patch(":id")
    @Roles("DOCTOR", "ADMIN")
    update(@Param("id") id: string, @Body() updateMedicineDto: UpdateMedicineDto) {
        return this.medicinesService.update(id, updateMedicineDto);
    }

    // Only ADMIN can delete medicines
    @Delete(":id")
    @Roles("ADMIN")
    remove(@Param("id") id: string) {
        return this.medicinesService.remove(id);
    }
}
