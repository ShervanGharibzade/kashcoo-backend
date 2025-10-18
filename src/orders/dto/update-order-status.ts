// dto/update-order-status.dto.ts
import { IsEnum } from 'class-validator';

export enum OrderStatus {
	PENDING = 'PENDING',
	PAID = 'PAID',
	CANCELLED = 'CANCELLED',
}

export class UpdateOrderStatusDto {
	@IsEnum(OrderStatus)
	status: OrderStatus;
}
