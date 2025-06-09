import { PartialType } from "@nestjs/mapped-types";
import { CreateMedicationPackageDto } from "./create-medication-package.dto";

export class UpdateMedicationPackageDto extends PartialType(CreateMedicationPackageDto) {}
