import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as express from 'express'; // 💡 اطمینان حاصل کن که yarn add @types/express --dev را اجرا کرده‌ای.
import * as bcrypt from 'bcrypt';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	async getHello() {
		return;
	}
}
