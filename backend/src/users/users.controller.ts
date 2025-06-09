import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("users")
@UseGuards(AccessTokenGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // Only ADMIN can create users
    @Post()
    @Roles("ADMIN")
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    // Only ADMIN and EMPLOYEE can view all users
    @Get()
    @Roles("ADMIN", "EMPLOYEE")
    findAll() {
        return this.usersService.findAll();
    }

    // Users can view their own profile, ADMIN/EMPLOYEE can view any user
    @Get("me")
    getMyProfile(@CurrentUser("userId") userId: string) {
        return this.usersService.findOne(userId);
    }

    @Get(":id")
    @Roles("ADMIN", "EMPLOYEE")
    findOne(@Param("id") id: string) {
        return this.usersService.findOne(id);
    }

    // Users can update their own profile, ADMIN can update any user
    @Patch("me")
    updateMyProfile(@CurrentUser("userId") userId: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(userId, updateUserDto);
    }

    @Patch(":id")
    @Roles("ADMIN")
    update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    // Only ADMIN can delete users
    @Delete(":id")
    @Roles("ADMIN")
    remove(@Param("id") id: string) {
        return this.usersService.remove(id);
    }
}
