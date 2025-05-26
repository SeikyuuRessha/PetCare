import { Injectable } from "@nestjs/common";
import { CreateServiceBookingDto } from "./dto/create-service-booking.dto";
import { UpdateServiceBookingDto } from "./dto/update-service-booking.dto";

@Injectable()
export class ServiceBookingsService {
    create(createServiceBookingDto: CreateServiceBookingDto) {
        return "This action adds a new serviceBooking";
    }

    findAll() {
        return `This action returns all serviceBookings`;
    }

    findOne(id: number) {
        return `This action returns a #${id} serviceBooking`;
    }

    update(id: number, updateServiceBookingDto: UpdateServiceBookingDto) {
        return `This action updates a #${id} serviceBooking`;
    }

    remove(id: number) {
        return `This action removes a #${id} serviceBooking`;
    }
}
