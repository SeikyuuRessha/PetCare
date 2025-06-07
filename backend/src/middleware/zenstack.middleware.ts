import { Injectable, NestMiddleware } from "@nestjs/common";
import { ZenStackMiddleware } from "@zenstackhq/server/express";
import type { Request, Response } from "express";
import { PrismaService } from "../common/prisma.service";
import { enhance } from "@zenstackhq/runtime";
import { ExceptionCode } from "../common/exception/exception-code";

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        username: string;
        role: string;
    };
}

@Injectable()
export class CrudMiddleware implements NestMiddleware {
    constructor(private readonly prismaService: PrismaService) {}
    async use(req: AuthenticatedRequest, res: Response, next: (error?) => void) {
        // Only apply ZenStack middleware to model routes
        const path = req.path;

        // Skip ZenStack for auth routes and other non-model routes
        if (path.startsWith("/auth") || path.startsWith("/docs") || path === "/") {
            return next();
        }

        // ===== CHECK ROLE TRƯỚC KHI ZENSTACK XỬ LÝ =====
        const userRole = req.user?.role;
        const requestPath = req.path;

        // 1. Không có user => Unauthorized
        if (!req.user) {
            return res.status(401).json({
                code: ExceptionCode.UNAUTHORIZED.code,
                message: ExceptionCode.UNAUTHORIZED.message,
                data: null,
            });
        }

        // 2. Kiểm tra role-specific restrictions dựa trên schema.zmodel

        // === USER ENDPOINTS ===
        // @@allow('read', auth().role == "ADMIN" || auth().role == "EMPLOYEE" || auth().role == "DOCTOR")
        if (requestPath.includes("/user/")) {
            if (!userRole || !["ADMIN", "EMPLOYEE", "DOCTOR"].includes(userRole)) {
                return res.status(403).json({
                    code: ExceptionCode.FORBIDDEN.code,
                    message:
                        "Chỉ admin, nhân viên và bác sĩ mới có thể truy cập thông tin người dùng",
                    data: null,
                });
            }
        }

        // === PET ENDPOINTS ===
        // @@allow('read,update', auth().role == "ADMIN" || auth().role == "EMPLOYEE" || auth().role == "DOCTOR")
        if (
            requestPath.includes("/pet/findMany") ||
            requestPath.includes("/pet/findFirst") ||
            requestPath.includes("/pet/count") ||
            requestPath.includes("/pet/aggregate") ||
            requestPath.includes("/pet/groupBy")
        ) {
            if (!userRole || !["ADMIN", "EMPLOYEE", "DOCTOR"].includes(userRole)) {
                return res.status(403).json({
                    code: ExceptionCode.FORBIDDEN.code,
                    message: "Bạn chỉ có thể xem thú cưng của mình thông qua endpoint khác",
                    data: null,
                });
            }
        }

        // === APPOINTMENT ENDPOINTS ===
        // @@allow('all', auth().role == "ADMIN" || auth().role == "EMPLOYEE" || auth().role == "DOCTOR")
        if (
            requestPath.includes("/appointment/findMany") ||
            requestPath.includes("/appointment/findFirst") ||
            requestPath.includes("/appointment/count") ||
            requestPath.includes("/appointment/aggregate") ||
            requestPath.includes("/appointment/groupBy")
        ) {
            if (!userRole || !["ADMIN", "EMPLOYEE", "DOCTOR"].includes(userRole)) {
                return res.status(403).json({
                    code: ExceptionCode.FORBIDDEN.code,
                    message: "Bạn chỉ có thể xem lịch hẹn của mình thông qua endpoint khác",
                    data: null,
                });
            }
        }

        // === MEDICAL RECORD ENDPOINTS ===
        // @@allow('all', auth().role == "ADMIN") + @@allow('all', doctor == auth())
        if (
            requestPath.includes("/medicalRecord/findMany") ||
            requestPath.includes("/medicalRecord/findFirst") ||
            requestPath.includes("/medicalRecord/count") ||
            requestPath.includes("/medicalRecord/aggregate") ||
            requestPath.includes("/medicalRecord/groupBy")
        ) {
            if (!userRole || !["ADMIN", "DOCTOR"].includes(userRole)) {
                return res.status(403).json({
                    code: ExceptionCode.FORBIDDEN.code,
                    message: "Chỉ admin và bác sĩ mới có thể xem hồ sơ y tế",
                    data: null,
                });
            }
        }

        // === SERVICE BOOKING ENDPOINTS ===
        // @@allow('all', auth().role == "ADMIN" || auth().role == "EMPLOYEE")
        if (
            requestPath.includes("/serviceBooking/findMany") ||
            requestPath.includes("/serviceBooking/findFirst") ||
            requestPath.includes("/serviceBooking/count") ||
            requestPath.includes("/serviceBooking/aggregate") ||
            requestPath.includes("/serviceBooking/groupBy")
        ) {
            if (!userRole || !["ADMIN", "EMPLOYEE"].includes(userRole)) {
                return res.status(403).json({
                    code: ExceptionCode.FORBIDDEN.code,
                    message: "Bạn chỉ có thể xem booking dịch vụ của mình thông qua endpoint khác",
                    data: null,
                });
            }
        }

        // === BOARDING RESERVATION ENDPOINTS ===
        // @@allow('all', auth().role == "ADMIN" || auth().role == "EMPLOYEE")
        if (
            requestPath.includes("/boardingReservation/findMany") ||
            requestPath.includes("/boardingReservation/findFirst") ||
            requestPath.includes("/boardingReservation/count") ||
            requestPath.includes("/boardingReservation/aggregate") ||
            requestPath.includes("/boardingReservation/groupBy")
        ) {
            if (!userRole || !["ADMIN", "EMPLOYEE"].includes(userRole)) {
                return res.status(403).json({
                    code: ExceptionCode.FORBIDDEN.code,
                    message: "Bạn chỉ có thể xem đặt phòng của mình thông qua endpoint khác",
                    data: null,
                });
            }
        }

        // === PRESCRIPTION ENDPOINTS ===
        // @@allow('all', auth().role == "ADMIN") + @@allow('all', medicalRecord.doctor == auth())
        if (
            requestPath.includes("/prescription/findMany") ||
            requestPath.includes("/prescription/findFirst") ||
            requestPath.includes("/prescription/count") ||
            requestPath.includes("/prescription/aggregate") ||
            requestPath.includes("/prescription/groupBy")
        ) {
            if (!userRole || !["ADMIN", "DOCTOR"].includes(userRole)) {
                return res.status(403).json({
                    code: ExceptionCode.FORBIDDEN.code,
                    message: "Chỉ admin và bác sĩ mới có thể xem đơn thuốc",
                    data: null,
                });
            }
        }

        // === PRESCRIPTION DETAIL ENDPOINTS ===
        // @@allow('all', auth().role == "ADMIN") + @@allow('all', prescription.medicalRecord.doctor == auth())
        if (
            requestPath.includes("/prescriptionDetail/findMany") ||
            requestPath.includes("/prescriptionDetail/findFirst") ||
            requestPath.includes("/prescriptionDetail/count") ||
            requestPath.includes("/prescriptionDetail/aggregate") ||
            requestPath.includes("/prescriptionDetail/groupBy")
        ) {
            if (!userRole || !["ADMIN", "DOCTOR"].includes(userRole)) {
                return res.status(403).json({
                    code: ExceptionCode.FORBIDDEN.code,
                    message: "Chỉ admin và bác sĩ mới có thể xem chi tiết đơn thuốc",
                    data: null,
                });
            }
        }

        // === PAYMENT ENDPOINTS ===
        // @@allow('all', auth().role == "ADMIN" || auth().role == "EMPLOYEE")
        if (
            requestPath.includes("/payment/findMany") ||
            requestPath.includes("/payment/findFirst") ||
            requestPath.includes("/payment/count") ||
            requestPath.includes("/payment/aggregate") ||
            requestPath.includes("/payment/groupBy")
        ) {
            if (!userRole || !["ADMIN", "EMPLOYEE"].includes(userRole)) {
                return res.status(403).json({
                    code: ExceptionCode.FORBIDDEN.code,
                    message: "Bạn chỉ có thể xem thanh toán của mình thông qua endpoint khác",
                    data: null,
                });
            }
        }

        // ===== CHỈ CHẠY ZENSTACK KHI ĐÃ PASS ROLE CHECK =====
        const inner = ZenStackMiddleware({
            getPrisma: () => {
                // Create enhanced Prisma client with user context for access control
                const userContext = req.user || {
                    userId: "anonymous",
                    username: "anonymous",
                    role: "ANONYMOUS",
                };

                console.log("🔒 ZenStack - User context:", userContext);
                console.log("🔗 ZenStack - Processing path:", path);

                return enhance(this.prismaService, {
                    user: userContext,
                });
            },
        });

        inner(req, res, next);
    }
}
