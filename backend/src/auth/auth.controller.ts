import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RefreshTokenDto, RegisterDto } from "./dto/auth.dto";
import { CurrentUser } from "./decorators/current-user.decorator";
import { handleService } from "../common/utils/handleService";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post("login")
    async login(@Body() loginDto: LoginDto) {
        return handleService(() => this.authService.login(loginDto));
    }

    @Post("register")
    async register(@Body() registerDto: RegisterDto) {
        return handleService(() => this.authService.register(registerDto));
    }

    @Post("logout")
    async logout(@CurrentUser("userId") userId: string) {
        return handleService(() => this.authService.logout(userId));
    }

    @Post("refresh")
    async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
        return handleService(() => this.authService.refreshTokens(refreshTokenDto.refreshToken));
    }
}
