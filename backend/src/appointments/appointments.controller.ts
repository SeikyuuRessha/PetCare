import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dtos/create-appointment.dto";
import { UpdateAppointmentDto } from "./dtos/update-appointment.dto";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

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

    // Get current user's appointments
    @Get("my/appointments")
    getMyAppointments(@CurrentUser("userId") userId: string) {
        return this.appointmentsService.findByUser(userId);
    }

    // Users can view their own appointments by userId, DOCTOR/ADMIN can view any user's appointments
    @Get("user/:userId")
    findByUser(
        @Param("userId") userId: string,
        @CurrentUser("userId") currentUserId: string,
        @CurrentUser("role") userRole: string
    ) {
        // Users can only view their own appointments, unless they are DOCTOR/ADMIN
        if (userRole === "USER" && userId !== currentUserId) {
            throw new Error("Access denied");
        }
        return this.appointmentsService.findByUser(userId);
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
    } // DOCTOR, ADMIN and EMPLOYEE can update any appointment
    @Patch(":id")
    @UseGuards(RolesGuard)
    @Roles("DOCTOR", "ADMIN", "EMPLOYEE")
    update(@Param("id") id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
        return this.appointmentsService.update(id, updateAppointmentDto);
    }

    // Allow users to cancel their own appointments
    @Patch(":id/cancel")
    cancelAppointment(@Param("id") id: string, @CurrentUser("userId") userId: string) {
        return this.appointmentsService.cancelAppointment(id, userId);
    }

    // DOCTOR and ADMIN can remove appointments
    @Delete(":id")
    @UseGuards(RolesGuard)
    @Roles("DOCTOR", "ADMIN")
    remove(@Param("id") id: string) {
        return this.appointmentsService.remove(id);
    }
}
