import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express'; // مطمئن شوید 'express' نصب شده است

/**
 * دکوراتور سفارشی برای استخراج اطلاعات کاربر (Payload) از شیء درخواست (Request)
 * فرض بر این است که JwtAuthGuard شیء کاربر را در req.user قرار می‌دهد
 * و ID کاربر در فیلد 'sub' ذخیره شده است.
 *
 * نحوه استفاده:
 * @ReqUser('sub') operatorId: number
 * @ReqUser() userPayload: any
 */
export const ReqUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest<Request>();

	if (!request.user) {
		return null; // یا throw new UnauthorizedException()
	}

	if (data) {
		// در صورتی که فیلد خاصی (مثل 'sub' یا 'role') درخواست شده باشد
		return request.user[data as string];
	}

	// در غیر این صورت، کل شیء کاربر را برمی‌گرداند
	return request.user;
});
