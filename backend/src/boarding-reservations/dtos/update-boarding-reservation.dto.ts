import { PartialType } from "@nestjs/mapped-types";
import { CreateBoardingReservationDto } from "./create-boarding-reservation.dto";

export class UpdateBoardingReservationDto extends PartialType(CreateBoardingReservationDto) {}
