import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceBookingDto } from './create-service-booking.dto';

export class UpdateServiceBookingDto extends PartialType(CreateServiceBookingDto) {}
