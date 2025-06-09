import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dtos/create-appointment.dto";
import { UpdateAppointmentDto } from "./dtos/update-appointment.dto";

@Controller("appointments")
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) {}

    @Post()
    create(@Body() createAppointmentDto: CreateAppointmentDto) {
        return this.appointmentsService.create(createAppointmentDto);
    }

    @Get()
    findAll() {
        return this.appointmentsService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.appointmentsService.findOne(id);
    }

    @Get("pet/:petId")
    findByPet(@Param("petId") petId: string) {
        return this.appointmentsService.findByPet(petId);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
        return this.appointmentsService.update(id, updateAppointmentDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.appointmentsService.remove(id);
    }
}
