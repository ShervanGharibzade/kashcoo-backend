// src/main.ts
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express'; // 💡 اطمینان حاصل کن که yarn add @types/express --dev را اجرا کرده‌ای.

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// --- تنظیمات CORS به‌روز شده ---
	app.enableCors({
		origin: '*', // یا آدرس فرانت‌اند شما (مثلاً http://localhost:3000)
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
		// 💡 رفع مشکل Preflight: اضافه کردن هدر 'time-zone'
		allowedHeaders: 'Content-Type, Accept, Authorization, time-zone',
	});
	// --------------------------------

	// --- تنظیمات سرو کردن فایل‌های استاتیک (Local Storage) ---
	// پوشه‌ی 'uploads' در روت پروژه (کنار src) باید ایجاد شده باشد.
	app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
	// -----------------------------------------------------------

	await app.listen(8000);
}
bootstrap();
