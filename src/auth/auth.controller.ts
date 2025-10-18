import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './strategies/jwt.strategy';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	signup(@Body() dto: SignupDto) {
		return this.authService.signup(dto);
	}

	@Post('login')
	login(@Body() dto: LoginDto) {
		return this.authService.login(dto);
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	logout(@Req() req) {
		const token = req.headers.authorization?.split(' ')[1];
		return this.authService.logout(token);
	}
}
