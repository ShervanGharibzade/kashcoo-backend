import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../entities/token.entity';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		@InjectRepository(Token)
		private readonly tokenRepo: Repository<Token>,
	) {}

	// 🟢 Signup
	async signup(dto: SignupDto) {
		const existingEmail = await this.usersService.findByEmail(dto.email);
		if (existingEmail) throw new ConflictException('Email already in use');

		const existingPhone = await this.usersService.findByPhone(dto.phoneNumber);
		if (existingPhone) throw new ConflictException('Phone number already in use');

		const hashed = await bcrypt.hash(dto.password, 10);

		const user = await this.usersService.create({
			firstName: dto.firstName,
			lastName: dto.lastName,
			phoneNumber: dto.phoneNumber,
			email: dto.email,
			password: hashed,
		});

		const { accessToken } = await this.generateToken(user);
		return { user, accessToken };
	}

	// 🟢 Login
	async login(dto: LoginDto) {
		const user = await this.usersService.findByEmail(dto.email, {
			relations: ['token'],
		});
		if (!user) throw new UnauthorizedException('Invalid credentials');

		const valid = await bcrypt.compare(dto.password, user.password);
		if (!valid) throw new UnauthorizedException('Invalid credentials');

		// حذف توکن قبلی اگر وجود دارد
		if (user.token?.id) {
			await this.tokenRepo.delete({ id: user.token.id });
		}

		const { accessToken } = await this.generateToken(user);
		return { user, accessToken };
	}

	// 🟢 Generate Token (اصلاح‌شده و یکتا)
	private async generateToken(user: any) {
		const payload = { sub: user.id, email: user.email };
		const tokenValue = this.jwtService.sign(payload, { expiresIn: '48h' });
		const expires = new Date(Date.now() + 48 * 60 * 60 * 1000);

		// حذف توکن‌های قبلی برای همین کاربر
		await this.tokenRepo.delete({ user: { id: user.id } });

		// ایجاد یا بروزرسانی توکن برای این کاربر
		await this.tokenRepo.upsert(
			{
				token: tokenValue,
				userId: user.id, // یا اگر در entity فیلد user است، بنویس user: { id: user.id }
				expiresAt: expires,
			},
			['userId'],
		);

		return { accessToken: tokenValue };
	}

	// 🟢 Logout
	async logout(token: string) {
		const record = await this.tokenRepo.findOne({ where: { token } });
		if (!record) throw new ForbiddenException('Token not found');
		record.revoked = true;
		await this.tokenRepo.save(record);
		return { message: 'Logged out successfully' };
	}

	// 🟢 پاک‌سازی توکن‌های منقضی یا لغو‌شده
	async cleanupExpiredTokens() {
		const now = new Date();
		await this.tokenRepo
			.createQueryBuilder()
			.delete()
			.where('expiresAt < :now', { now })
			.orWhere('revoked = true')
			.execute();
	}
}
