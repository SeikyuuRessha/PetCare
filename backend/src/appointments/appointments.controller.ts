import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dtos/create-appointment.dto";
import { UpdateAppointmentDto } from "./dtos/update-appointment.dto";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("appointments")
@UseGuards(AccessTokenGuard)
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) {}

    // All authenticated users can create appointments
    @Post()
    create(@Body() createAppointmentDto: CreateAppointmentDto) {
        return this.appointmentsService.create(createAppointmentDto);
    }

    // Only DOCTOR and ADMIN can view all appointments
    @Get()
    @UseGuards(RolesGuard)
    @Roles("DOCTOR", "ADMIN", "EMPLOYEE")
    findAll() {
        return this.appointmentsService.findAll();
    }

    // DOCTOR/ADMIN/EMPLOYEE can view any appointment, USER can view own appointments
    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.appointmentsService.findOne(id);
    }

    // All authenticated users can view appointments by pet (for their own pets)
    @Get("pet/:petId")
    findByPet(@Param("petId") petId: string) {
        return this.appointmentsService.findByPet(petId);
    }

    // DOCTOR and ADMIN can update any appointment, USER can update own appointments
    @Patch(":id")
    update(@Param("id") id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
        return this.appointmentsService.update(id, updateAppointmentDto);
    }

    // DOCTOR and ADMIN can cancel appointments
    @Delete(":id")
    @UseGuards(RolesGuard)
    @Roles("DOCTOR", "ADMIN")
    remove(@Param("id") id: string) {
        return this.appointmentsService.remove(id);
    }
}
