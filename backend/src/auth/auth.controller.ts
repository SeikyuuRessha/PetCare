import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService, LoginDto, RegisterDto } from "./auth.service";
import { Public } from "./decorators/auth.decorators";
import { CurrentUser } from "./decorators/current-user.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("auth")
@ApiTags("Authentication")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    @Public()
    @ApiOperation({ summary: "Register new user" })
    @ApiResponse({ status: 201, description: "User registered successfully" })
    @ApiResponse({ status: 409, description: "User already exists" })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post("login")
    @Public()
    @ApiOperation({ summary: "User login" })
    @ApiResponse({ status: 200, description: "Login successful" })
    @ApiResponse({ status: 401, description: "Invalid credentials" })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get("profile")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth("JWT-auth")
    @ApiOperation({ summary: "Get current user profile" })
    @ApiResponse({ status: 200, description: "Profile retrieved successfully" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    async getProfile(@CurrentUser() user: any) {
        return this.authService.getProfile(user.userId);
    }
}
