import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dtos/create-payment.dto";
import { UpdatePaymentDto } from "./dtos/update-payment.dto";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("payments")
@UseGuards(AccessTokenGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    // All authenticated users can create payments
    @Post()
    create(@Body() createPaymentDto: CreatePaymentDto) {
        return this.paymentsService.create(createPaymentDto);
    }

    // Only ADMIN and EMPLOYEE can view all payments
    @Get()
    @UseGuards(RolesGuard)
    @Roles("ADMIN", "EMPLOYEE")
    findAll() {
        return this.paymentsService.findAll();
    }

    // Users can view specific payment if it's theirs, ADMIN/EMPLOYEE can view any payment
    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.paymentsService.findOne(id);
    }

    // Users can view their own payments, ADMIN/EMPLOYEE can view any user's payments
    @Get("user/:userId")
    findByUser(
        @Param("userId") userId: string,
        @CurrentUser("userId") currentUserId: string,
        @CurrentUser("role") userRole: string
    ) {
        return this.paymentsService.findByUser(userId);
    }

    // Get current user's payments
    @Get("my/payments")
    getMyPayments(@CurrentUser("userId") userId: string) {
        return this.paymentsService.findByUser(userId);
    }

    // Only ADMIN and EMPLOYEE can update payments
    @Patch(":id")
    @UseGuards(RolesGuard)
    @Roles("USER")
    update(@Param("id") id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
        return this.paymentsService.update(id, updatePaymentDto);
    }

    // Only ADMIN can delete payments
    @Delete(":id")
    @UseGuards(RolesGuard)
    @Roles("USER", "ADMIN", "EMPLOYEE")
    remove(@Param("id") id: string) {
        return this.paymentsService.remove(id);
    }
}
