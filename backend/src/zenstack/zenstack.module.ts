import { Module } from "@nestjs/common";
import { ZenStackService } from "./zenstack.service";

@Module({
    providers: [ZenStackService],
    exports: [ZenStackService],
})
export class ZenStackModule {}
