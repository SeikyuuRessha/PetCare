import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { ServiceBookingsService } from "./service-bookings.service";
import { CreateServiceBookingDto } from "./dtos/create-service-booking.dto";
import { UpdateServiceBookingDto } from "./dtos/update-service-booking.dto";

@Controller("service-bookings")
export class ServiceBookingsController {
    constructor(private readonly serviceBookingsService: ServiceBookingsService) {}

    @Post()
    create(@Body() createServiceBookingDto: CreateServiceBookingDto) {
        return this.serviceBookingsService.create(createServiceBookingDto);
    }

    @Get()
    findAll() {
        return this.serviceBookingsService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.serviceBookingsService.findOne(id);
    }

    @Get("pet/:petId")
    findByPet(@Param("petId") petId: string) {
        return this.serviceBookingsService.findByPet(petId);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateServiceBookingDto: UpdateServiceBookingDto) {
        return this.serviceBookingsService.update(id, updateServiceBookingDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.serviceBookingsService.remove(id);
    }
}
