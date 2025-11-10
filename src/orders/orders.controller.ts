// orders.controller.ts
import { Controller, Post, Get, Body, UseGuards, Req, Param, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { UpdateOrderStatusDto } from './dto/update-order-status';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@Post()
	async create(@Req() req: Request, @Body() dto: CreateOrderDto) {
		const user = req.user as User;
		return this.ordersService.create(user, dto);
	}

	@Get('me')
	async findMyOrders(@Req() req: Request) {
		const user = req.user as User;
		return this.ordersService.findForUser(user);
	}

	@Get()
	async listOrders() {
		return this.ordersService.findAll();
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('ADMIN', 'SUPER_ADMIN')
	@Patch(':id/status')
	async updateStatus(@Param('id') id: number, @Body() dto: UpdateOrderStatusDto) {
		return this.ordersService.updateStatus(id, dto);
	}
}
