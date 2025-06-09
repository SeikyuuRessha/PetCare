import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { CreateRoomDto } from "./dtos/create-room.dto";
import { UpdateRoomDto } from "./dtos/update-room.dto";

@Controller("rooms")
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    @Post()
    create(@Body() createRoomDto: CreateRoomDto) {
        return this.roomsService.create(createRoomDto);
    }

    @Get()
    findAll() {
        return this.roomsService.findAll();
    }

    @Get("available")
    findAvailable() {
        return this.roomsService.findAvailable();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.roomsService.findOne(id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateRoomDto: UpdateRoomDto) {
        return this.roomsService.update(id, updateRoomDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.roomsService.remove(id);
    }
}
