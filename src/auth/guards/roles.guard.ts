import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from '../../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		// 👇 متادیتا رو از Decorator می‌خونه
		const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		// اگه مسیر خاصی نقشی نخواسته باشه، اجازه بده
		if (!requiredRoles) return true;

		const request = context.switchToHttp().getRequest();
		const user: User = request.user;

		if (!user) {
			throw new ForbiddenException('احراز هویت کاربر انجام نشده است');
		}

		const hasRole = requiredRoles.includes(user.role);

		if (!hasRole) {
			throw new ForbiddenException('شما اجازه دسترسی به این بخش را ندارید 🚫');
		}

		return true;
	}
}
