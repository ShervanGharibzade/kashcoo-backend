import { Injectable, BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin, AdminRole } from './admin.entity';
import { AdminCreateDto } from './dto/admin-create.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminAuthService {
	constructor(
		@InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
		private readonly jwt: JwtService,
	) {}

	async login(dto: AdminLoginDto) {
		const admin = await this.adminRepo.findOne({ where: { email: dto.email } });
		if (!admin) throw new UnauthorizedException('Invalid credentials');

		const ok = await bcrypt.compare(dto.password, admin.password);
		if (!ok) throw new UnauthorizedException('Invalid credentials');

		if (!admin.isActive) throw new ForbiddenException('Admin account is not active');

		const payload = { sub: admin.id, role: admin.role, scope: 'admin' };
		const token = await this.jwt.signAsync(payload);
		return { access_token: token, admin: { id: admin.id, email: admin.email, role: admin.role } };
	}

	async createAdmin(dto: AdminCreateDto, operatorId: number) {
		const operator = await this.adminRepo.findOne({ where: { id: operatorId } });
		if (!operator || operator.role !== AdminRole.SUPER_ADMIN) {
			throw new ForbiddenException('Only SUPER_ADMIN can create admins');
		}

		const exists = await this.adminRepo.findOne({ where: { email: dto.email } });
		if (exists) throw new BadRequestException('Email already in use');

		const hash = await bcrypt.hash(dto.password, 10);

		const newAdmin = this.adminRepo.create({
			firstName: dto.firstName,
			lastName: dto.lastName,
			email: dto.email,
			password: hash,
			role: AdminRole.ADMIN,
			isActive: false, // default disabled
		});

		return this.adminRepo.save(newAdmin);
	}
}
