import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService, LoginDto, RegisterDto } from "./auth.service";
import { Public } from "./decorators/auth.decorators";
import { CurrentUser } from "./decorators/current-user.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { handleService } from "../common/utils/handleService";
import { ISuccessResponse } from "../common/interfaces/response.interface";

@Controller("auth")
@ApiTags("Authentication")
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post("register")
    @Public()
    @ApiOperation({ summary: "Register new user" })
    @ApiResponse({ status: 201, description: "User registered successfully" })
    @ApiResponse({ status: 409, description: "User already exists" })
    async register(@Body() registerDto: RegisterDto): Promise<ISuccessResponse<any>> {
        return handleService(
            () => this.authService.register(registerDto),
            "User registered successfully"
        );
    }

    @Post("login")
    @Public()
    @ApiOperation({ summary: "User login" })
    @ApiResponse({ status: 200, description: "Login successful" })
    @ApiResponse({ status: 401, description: "Invalid credentials" })
    async login(@Body() loginDto: LoginDto): Promise<ISuccessResponse<any>> {
        return handleService(() => this.authService.login(loginDto), "Login successful");
    }

    @Get("profile")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth("JWT-auth")
    @ApiOperation({ summary: "Get current user profile" })
    @ApiResponse({ status: 200, description: "Profile retrieved successfully" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    async getProfile(@CurrentUser() user: any): Promise<ISuccessResponse<any>> {
        return handleService(
            () => this.authService.getProfile(user.userId),
            "Profile retrieved successfully"
        );
    }
}
