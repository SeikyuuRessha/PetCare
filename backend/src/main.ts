import { NestFactory, Reflector } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { RolesGuard } from "./auth/guards/roles.guard";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { CustomValidationPipe } from "./common/pipes/custom-validation.pipe";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import * as dotenv from "dotenv";

// @ts-ignore
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    dotenv.config();

    // Enable CORS
    app.enableCors(); // Set global prefix for API routes
    app.setGlobalPrefix("api"); // Global exception filter
    app.useGlobalFilters(new GlobalExceptionFilter());

    // Global validation pipe
    app.useGlobalPipes(new CustomValidationPipe());

    // Global response interceptor
    app.useGlobalInterceptors(new ResponseInterceptor());

    // Apply global authentication guard
    const reflector = app.get(Reflector);
    app.useGlobalGuards(new JwtAuthGuard(reflector));
    app.useGlobalGuards(new RolesGuard(reflector));

    // Swagger setup
    const config = new DocumentBuilder()
        .setTitle("PetCare API")
        .setDescription("PetCare management system API")
        .setVersion("1.0")
        .addBearerAuth(
            {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                name: "JWT",
                description: "Enter JWT token",
                in: "header",
            },
            "JWT-auth"
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);

    let port = process.env.PORT ?? 8080;

    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`Swagger docs: http://localhost:${port}/api/docs`);
    console.log(`ZenStack API: http://localhost:${port}/api`);
}

bootstrap();
