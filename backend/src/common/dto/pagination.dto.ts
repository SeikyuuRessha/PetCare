import { Type } from "class-transformer";
import { IsOptional, IsPositive, Max } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    @Max(100)
    limit?: number = 10;
    get skip(): number {
        return ((this.page || 1) - 1) * (this.limit || 10);
    }
}
