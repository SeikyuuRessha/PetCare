import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { CustomValidationPipe } from "./common/pipes/custom-validation.pipe";

// Fix BigInt serialization issue
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix("api");
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalPipes(new CustomValidationPipe());

    const config = new DocumentBuilder()
        .setTitle("PetCare API")
        .setDescription(
            "API documentation for the PetCare application. " +
                "Provides endpoints for managing users, pets, appointments, services, and more."
        )
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api-docs", app, document);

    await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
