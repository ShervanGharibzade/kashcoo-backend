import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthService } from './auth.service';

@Injectable()
export class TokenCleanupService {
	constructor(private readonly authService: AuthService) {}

	@Cron(CronExpression.EVERY_HOUR)
	async handleCron() {
		await this.authService.cleanupExpiredTokens();
	}
}
