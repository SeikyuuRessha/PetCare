import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { ServiceBookingsService } from "./service-bookings.service";
import { CreateServiceBookingDto } from "./dtos/create-service-booking.dto";
import { UpdateServiceBookingDto } from "./dtos/update-service-booking.dto";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("service-bookings")
@UseGuards(AccessTokenGuard)
export class ServiceBookingsController {
    constructor(private readonly serviceBookingsService: ServiceBookingsService) {}

    // All authenticated users can create service bookings
    @Post()
    create(@Body() createServiceBookingDto: CreateServiceBookingDto) {
        return this.serviceBookingsService.create(createServiceBookingDto);
    }

    // Only EMPLOYEE and ADMIN can view all service bookings
    @Get()
    @UseGuards(RolesGuard)
    @Roles("EMPLOYEE", "ADMIN")
    findAll() {
        return this.serviceBookingsService.findAll();
    }

    // Users can view specific booking, EMPLOYEE/ADMIN can view any booking
    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.serviceBookingsService.findOne(id);
    }

    // Users can view bookings for their pets, EMPLOYEE/ADMIN can view any pet's bookings
    @Get("pet/:petId")
    findByPet(@Param("petId") petId: string) {
        return this.serviceBookingsService.findByPet(petId);
    }

    // EMPLOYEE and ADMIN can update service bookings
    @Patch(":id")
    @UseGuards(RolesGuard)
    @Roles("EMPLOYEE", "ADMIN")
    update(@Param("id") id: string, @Body() updateServiceBookingDto: UpdateServiceBookingDto) {
        return this.serviceBookingsService.update(id, updateServiceBookingDto);
    }

    // Only ADMIN can delete service bookings
    @Delete(":id")
    @UseGuards(RolesGuard)
    @Roles("ADMIN")
    remove(@Param("id") id: string) {
        return this.serviceBookingsService.remove(id);
    }
}
