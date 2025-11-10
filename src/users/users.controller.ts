import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	async getProfile(@Req() req) {
		const userId = req.user.userId;
		return this.usersService.findById(userId);
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	async getUserList() {
		return this.usersService.findAll();
	}

	@Get(':id')
	async getUser(@Param('id') id: number) {
		return this.usersService.findById(id);
	}
}
