import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { PetsService } from "./pets.service";
import { CreatePetDto } from "./dtos/create-pet.dto";
import { UpdatePetDto } from "./dtos/update-pet.dto";

@Controller("pets")
export class PetsController {
    constructor(private readonly petsService: PetsService) {}

    @Post()
    create(@Body() createPetDto: CreatePetDto) {
        return this.petsService.create(createPetDto);
    }

    @Get()
    findAll() {
        return this.petsService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.petsService.findOne(id);
    }

    @Get("owner/:ownerId")
    findByOwner(@Param("ownerId") ownerId: string) {
        return this.petsService.findByOwner(ownerId);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updatePetDto: UpdatePetDto) {
        return this.petsService.update(id, updatePetDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.petsService.remove(id);
    }
}
