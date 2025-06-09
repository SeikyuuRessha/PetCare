import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { CreateRoomDto } from "./dtos/create-room.dto";
import { UpdateRoomDto } from "./dtos/update-room.dto";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("rooms")
@UseGuards(AccessTokenGuard, RolesGuard)
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    // Only ADMIN and EMPLOYEE can create rooms
    @Post()
    @Roles("ADMIN", "EMPLOYEE")
    create(@Body() createRoomDto: CreateRoomDto) {
        return this.roomsService.create(createRoomDto);
    }

    // ADMIN and EMPLOYEE can view all rooms
    @Get()
    @Roles("ADMIN", "EMPLOYEE")
    findAll() {
        return this.roomsService.findAll();
    }

    // ADMIN and EMPLOYEE can view available rooms
    @Get("available")
    @Roles("ADMIN", "EMPLOYEE")
    findAvailable() {
        return this.roomsService.findAvailable();
    }

    // ADMIN and EMPLOYEE can view specific room
    @Get(":id")
    @Roles("ADMIN", "EMPLOYEE")
    findOne(@Param("id") id: string) {
        return this.roomsService.findOne(id);
    }

    // Only ADMIN and EMPLOYEE can update rooms
    @Patch(":id")
    @Roles("ADMIN", "EMPLOYEE")
    update(@Param("id") id: string, @Body() updateRoomDto: UpdateRoomDto) {
        return this.roomsService.update(id, updateRoomDto);
    }

    // Only ADMIN can delete rooms
    @Delete(":id")
    @Roles("ADMIN")
    remove(@Param("id") id: string) {
        return this.roomsService.remove(id);
    }
}
