import { PartialType } from "@nestjs/mapped-types";
import { CreateServiceOptionDto } from "./create-service-option.dto";

export class UpdateServiceOptionDto extends PartialType(CreateServiceOptionDto) {}
