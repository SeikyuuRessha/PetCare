import { PartialType } from "@nestjs/mapped-types";
import { CreatePrescriptionDetailDto } from "./create-prescription-detail.dto";

export class UpdatePrescriptionDetailDto extends PartialType(CreatePrescriptionDetailDto) {}
