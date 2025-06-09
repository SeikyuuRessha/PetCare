import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { ServiceOptionsService } from "./service-options.service";
import { CreateServiceOptionDto } from "./dtos/create-service-option.dto";
import { UpdateServiceOptionDto } from "./dtos/update-service-option.dto";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("service-options")
export class ServiceOptionsController {
    constructor(private readonly serviceOptionsService: ServiceOptionsService) {}

    // Only ADMIN and EMPLOYEE can create service options
    @Post()
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles("ADMIN", "EMPLOYEE")
    create(@Body() createServiceOptionDto: CreateServiceOptionDto) {
        return this.serviceOptionsService.create(createServiceOptionDto);
    }

    // Everyone can view all service options
    @Get()
    findAll() {
        return this.serviceOptionsService.findAll();
    }

    // Everyone can view specific service option
    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.serviceOptionsService.findOne(id);
    }

    // Everyone can view service options by service
    @Get("service/:serviceId")
    findByService(@Param("serviceId") serviceId: string) {
        return this.serviceOptionsService.findByService(serviceId);
    }

    // Only ADMIN and EMPLOYEE can update service options
    @Patch(":id")
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles("ADMIN", "EMPLOYEE")
    update(@Param("id") id: string, @Body() updateServiceOptionDto: UpdateServiceOptionDto) {
        return this.serviceOptionsService.update(id, updateServiceOptionDto);
    }

    // Only ADMIN can delete service options
    @Delete(":id")
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles("ADMIN")
    remove(@Param("id") id: string) {
        return this.serviceOptionsService.remove(id);
    }
}
