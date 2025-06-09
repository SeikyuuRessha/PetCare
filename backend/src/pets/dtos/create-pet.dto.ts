import { IsString, IsOptional, IsEnum, IsUrl } from "class-validator";
import { PetGender } from "../../common/enums";

export class CreatePetDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsEnum(PetGender)
    gender?: PetGender;

    @IsOptional()
    @IsString()
    species?: string;

    @IsOptional()
    @IsString()
    breed?: string;

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsUrl()
    imageUrl?: string;

    @IsOptional()
    @IsString()
    identifyingMarks?: string;

    @IsString()
    ownerId: string;
}
