// orders.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status';

@Injectable()
export class OrdersService {
	constructor(
		@InjectRepository(Order) private orderRepo: Repository<Order>,
		@InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,
		@InjectRepository(Product) private productRepo: Repository<Product>,
	) {}

	async create(user: User, dto: CreateOrderDto) {
		let total = 0;
		const items: OrderItem[] = [];

		for (const itemData of dto.items) {
			const product = await this.productRepo.findOne({
				where: { id: itemData.productId },
			});
			if (!product) throw new NotFoundException(`Product #${itemData.productId} not found`);

			if (product.stock < itemData.quantity) throw new BadRequestException(`Insufficient stock for ${product.name}`);

			// محاسبه قیمت نهایی کسر تخفیف
			const finalPrice = product.price * (1 - (product.discountPercent ?? 0) / 100);
			const totalPrice = finalPrice * itemData.quantity;

			// ساخت آیتم سفارش
			const orderItem = this.itemRepo.create({
				product,
				quantity: itemData.quantity,
				priceAtPurchase: finalPrice,
				total: totalPrice,
			});

			items.push(orderItem);
			total += totalPrice;

			// کاهش موجودی
			product.stock -= itemData.quantity;
			await this.productRepo.save(product);
		}

		// ساخت سفارش
		const order = this.orderRepo.create({
			user,
			items,
			totalPrice: total,
			status: 'PENDING',
		});

		return this.orderRepo.save(order);
	}

	async updateStatus(id: number, dto: UpdateOrderStatusDto) {
		const order = await this.orderRepo.findOne({ where: { id } });
		if (!order) throw new NotFoundException('Order not found');
		order.status = dto.status;
		return this.orderRepo.save(order);
	}

	async findForUser(user: User) {
		return this.orderRepo.find({
			where: { user: { id: user.id } },
			relations: ['items', 'items.product'],
		});
	}
}
