import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { ServicesService } from "./services.service";
import { CreateServiceDto } from "./dtos/create-service.dto";
import { UpdateServiceDto } from "./dtos/update-service.dto";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("services")
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {}

    // Only ADMIN and EMPLOYEE can create services
    @Post()
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles("ADMIN", "EMPLOYEE")
    create(@Body() createServiceDto: CreateServiceDto) {
        return this.servicesService.create(createServiceDto);
    }

    // Everyone can view available services
    @Get()
    findAll() {
        return this.servicesService.findAll();
    }

    // Everyone can view specific service details
    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.servicesService.findOne(id);
    }

    // Only ADMIN and EMPLOYEE can update services
    @Patch(":id")
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles("ADMIN", "EMPLOYEE")
    update(@Param("id") id: string, @Body() updateServiceDto: UpdateServiceDto) {
        return this.servicesService.update(id, updateServiceDto);
    }

    // Only ADMIN can delete services
    @Delete(":id")
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles("ADMIN")
    remove(@Param("id") id: string) {
        return this.servicesService.remove(id);
    }
}
