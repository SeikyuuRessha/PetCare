import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { BoardingReservationsService } from "./boarding-reservations.service";
import { CreateBoardingReservationDto } from "./dto/create-boarding-reservation.dto";
import { UpdateBoardingReservationDto } from "./dto/update-boarding-reservation.dto";

@Controller("boarding-reservations")
export class BoardingReservationsController {
    constructor(private readonly boardingReservationsService: BoardingReservationsService) {}

    @Post()
    create(@Body() createBoardingReservationDto: CreateBoardingReservationDto) {
        return this.boardingReservationsService.create(createBoardingReservationDto);
    }

    @Get()
    findAll() {
        return this.boardingReservationsService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.boardingReservationsService.findOne(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateBoardingReservationDto: UpdateBoardingReservationDto
    ) {
        return this.boardingReservationsService.update(+id, updateBoardingReservationDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.boardingReservationsService.remove(+id);
    }
}
