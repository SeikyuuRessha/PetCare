import { Injectable, type OnModuleInit, Logger } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PrismaService
    extends PrismaClient<Prisma.PrismaClientOptions, "query" | "error" | "info" | "warn">
    implements OnModuleInit
{
    private readonly logger = new Logger(PrismaService.name);
    private readonly isDevelopment: boolean;

    constructor(private configService?: ConfigService) {
        super({
            log: [
                {
                    emit: "event",
                    level: "query",
                },
                {
                    emit: "event",
                    level: "error",
                },
                {
                    emit: "event",
                    level: "info",
                },
                {
                    emit: "event",
                    level: "warn",
                },
            ],
        });

        this.isDevelopment =
            configService?.get<string>("NODE_ENV", "development") === "development";
    }

    async onModuleInit() {
        if (this.isDevelopment) {
            this.$on("query", (e) => {
                const executionTime = e.duration ? `${Math.round(e.duration)}ms` : "N/A";

                console.log("\n");
                console.log("----------------------------------------");
                console.log(`🔍 PRISMA QUERY`);
                console.log(`⏱️  Execution time: ${executionTime}`);
                console.log("----------------------------------------");
                console.log(e.query);

                if (e.params && e.params !== "[]") {
                    try {
                        const params = JSON.parse(e.params);
                        console.log("\n📝 PARAMETERS:");
                        console.table(params);
                    } catch (error) {
                        console.log("\n📝 PARAMETERS:", e.params);
                    }
                }
                console.log("----------------------------------------\n");
            });
        }

        this.$on("error", (e) => {
            this.logger.error(`❌ Database error: ${e.message}`, e.target);
        });

        this.$on("info", (e) => {
            this.logger.log(`ℹ️ ${e.message}`, e.target);
        });

        this.$on("warn", (e) => {
            this.logger.warn(`⚠️ ${e.message}`, e.target);
        });

        await this.$connect()
            .then(() => {
                this.logger.log("✅ Successfully connected to database");
            })
            .catch((error) => {
                this.logger.error(`❌ Failed to connect to database: ${error.message}`);
                throw error;
            });
    }
}
