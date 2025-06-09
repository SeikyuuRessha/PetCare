import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { PetsService } from "./pets.service";
import { CreatePetDto } from "./dtos/create-pet.dto";
import { UpdatePetDto } from "./dtos/update-pet.dto";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("pets")
@UseGuards(AccessTokenGuard)
export class PetsController {
    constructor(private readonly petsService: PetsService) {}

    // All authenticated users can create pets
    @Post()
    create(@Body() createPetDto: CreatePetDto, @CurrentUser("userId") userId: string) {
        // Set the owner to current user if not specified
        if (!createPetDto.ownerId) {
            createPetDto.ownerId = userId;
        }
        return this.petsService.create(createPetDto);
    }

    // Only ADMIN and EMPLOYEE can view all pets
    @Get()
    @UseGuards(RolesGuard)
    @Roles("ADMIN", "EMPLOYEE")
    findAll() {
        return this.petsService.findAll();
    }

    // Users can view specific pet if they own it, ADMIN/EMPLOYEE can view any pet
    @Get(":id")
    findOne(@Param("id") id: string, @CurrentUser("userId") userId: string, @CurrentUser("role") userRole: string) {
        return this.petsService.findOne(id);
    }

    // Get current user's pets
    @Get("my/pets")
    getMyPets(@CurrentUser("userId") userId: string) {
        return this.petsService.findByOwner(userId);
    }

    // Only ADMIN and EMPLOYEE can search pets by owner
    @Get("owner/:ownerId")
    @UseGuards(RolesGuard)
    @Roles("ADMIN", "EMPLOYEE")
    findByOwner(@Param("ownerId") ownerId: string) {
        return this.petsService.findByOwner(ownerId);
    }

    // Users can update their own pets, ADMIN can update any pet
    @Patch(":id")
    update(@Param("id") id: string, @Body() updatePetDto: UpdatePetDto) {
        return this.petsService.update(id, updatePetDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.petsService.remove(id);
    }
}
