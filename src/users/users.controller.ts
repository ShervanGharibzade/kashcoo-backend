import { Controller, Get, Param, UseGuards, Req, Body, Post, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { Request } from 'express';
import { Address } from 'src/entities/address.entity';
import { User } from 'src/entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	// ------------------- USER ROUTES -------------------

	@Get('me')
	async getProfile(@Req() req: Request) {
		const user = req.user as User;
		return this.usersService.findById(user.id);
	}

	@Get()
	async getUserList() {
		return this.usersService.findAll();
	}

	@Get(':id')
	async getUser(@Param('id') id: number) {
		return this.usersService.findById(id);
	}

	// ------------------- ADDRESS ROUTES -------------------

	@Get('me/addresses')
	async getMyAddresses(@Req() req: Request) {
		const user = req.user as { userId: number; email: string };

		return this.usersService.findAllAddresses(user.userId);
	}

	@Get(':id/addresses')
	async getUserAddresses(@Param('id') id: number) {
		const user = await this.usersService.findById(id);
		return this.usersService.findAllAddresses(user.id);
	}

	@Post('me/addresses')
	@UseGuards(JwtAuthGuard)
	async createAddress(@Req() req: any, @Body() body: Partial<Address>) {
		const userId = req.user.userId; // from JWT
		const user = await this.usersService.findById(userId); // fetch full entity
		return this.usersService.createAddress(user, body);
	}

	@Patch('me/addresses/:id')
	async updateAddress(@Req() req: Request, @Param('id') id: number, @Body() body: Partial<Address>) {
		const user = req.user as any;
		return this.usersService.updateAddress(user, Number(id), body);
	}

	@Delete('me/addresses/:id')
	async removeAddress(@Req() req: Request, @Param('id') id: number) {
		const user = req.user as any;
		return this.usersService.removeAddress(user, Number(id));
	}
}
