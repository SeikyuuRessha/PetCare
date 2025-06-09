import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { BoardingReservationsService } from "./boarding-reservations.service";
import { CreateBoardingReservationDto } from "./dtos/create-boarding-reservation.dto";
import { UpdateBoardingReservationDto } from "./dtos/update-boarding-reservation.dto";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("boarding-reservations")
@UseGuards(AccessTokenGuard)
export class BoardingReservationsController {
    constructor(private readonly boardingReservationsService: BoardingReservationsService) {}

    // All authenticated users can create boarding reservations
    @Post()
    create(@Body() createBoardingReservationDto: CreateBoardingReservationDto) {
        return this.boardingReservationsService.create(createBoardingReservationDto);
    }

    // Only EMPLOYEE and ADMIN can view all boarding reservations
    @Get()
    @UseGuards(RolesGuard)
    @Roles("EMPLOYEE", "ADMIN")
    findAll() {
        return this.boardingReservationsService.findAll();
    }

    // Users can view specific reservation, EMPLOYEE/ADMIN can view any reservation
    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.boardingReservationsService.findOne(id);
    }

    // Users can view reservations for their pets, EMPLOYEE/ADMIN can view any pet's reservations
    @Get("pet/:petId")
    findByPet(@Param("petId") petId: string) {
        return this.boardingReservationsService.findByPet(petId);
    }

    // EMPLOYEE and ADMIN can update boarding reservations
    @Patch(":id")
    @UseGuards(RolesGuard)
    @Roles("EMPLOYEE", "ADMIN")
    update(@Param("id") id: string, @Body() updateBoardingReservationDto: UpdateBoardingReservationDto) {
        return this.boardingReservationsService.update(id, updateBoardingReservationDto);
    }

    // Only ADMIN can delete boarding reservations
    @Delete(":id")
    @UseGuards(RolesGuard)
    @Roles("ADMIN")
    remove(@Param("id") id: string) {
        return this.boardingReservationsService.remove(id);
    }
}
