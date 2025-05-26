import { Injectable } from "@nestjs/common";
import { CreateBoardingReservationDto } from "./dto/create-boarding-reservation.dto";
import { UpdateBoardingReservationDto } from "./dto/update-boarding-reservation.dto";

@Injectable()
export class BoardingReservationsService {
    create(createBoardingReservationDto: CreateBoardingReservationDto) {
        return "This action adds a new boardingReservation";
    }

    findAll() {
        return `This action returns all boardingReservations`;
    }

    findOne(id: number) {
        return `This action returns a #${id} boardingReservation`;
    }

    update(id: number, updateBoardingReservationDto: UpdateBoardingReservationDto) {
        return `This action updates a #${id} boardingReservation`;
    }

    remove(id: number) {
        return `This action removes a #${id} boardingReservation`;
    }
}
