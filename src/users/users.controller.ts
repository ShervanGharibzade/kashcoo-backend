import { Controller, Get, Param, UseGuards, Req, Body, Post, Patch, Delete } from '@nestjs/common';
import { Request } from 'express';

import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { Address } from 'src/entities/address.entity';
import { User } from 'src/entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	// ==================================================
	// USER - CURRENT USER (STATIC ROUTES FIRST)
	// ==================================================

	@Get('me')
	async getProfile(@Req() req: Request) {
		const user = req.user as User;
		return this.usersService.findById(user.id);
	}

	@Get('me/addresses')
	async getMyAddresses(@Req() req: Request) {
		const user = req.user as User;
		return this.usersService.findAllAddresses(user.id);
	}

	@Post('addresses')
	async createAddress(@Req() req: Request, @Body() body: Partial<Address>) {
		const user = req.user as User;
		return this.usersService.createAddress(user, body);
	}

	@Patch('addresses/:id')
	async updateAddress(@Req() req: Request, @Param('id') id: string, @Body() body: Partial<Address>) {
		const user = req.user as User;
		return this.usersService.updateAddress(user, Number(id), body);
	}

	@Delete('addresses/:id')
	async removeAddress(@Req() req: Request, @Param('id') id: string) {
		const user = req.user as User;
		return this.usersService.removeAddress(user, Number(id));
	}

	// ==================================================
	// USER - GENERIC ROUTES (DYNAMIC ROUTES LAST)
	// ==================================================

	@Get()
	async getUserList() {
		return this.usersService.findAll();
	}

	@Get(':id')
	async getUser(@Param('id') id: string) {
		return this.usersService.findById(Number(id));
	}

	@Get(':id/addresses')
	async getUserAddresses(@Param('id') id: string) {
		return this.usersService.findAllAddresses(Number(id));
	}
}
