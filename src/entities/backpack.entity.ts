// src/entities/backpack.entity.ts
import { ChildEntity, Column } from 'typeorm';
import { Product } from './product.entity';

@ChildEntity('backpack') // از 'backpack' به عنوان نوع (discriminator value) در جدول Product استفاده می‌شود
export class Backpack extends Product {
	// فیلدهای تخصصی کوله‌پشتی
	@Column({ type: 'int', nullable: true })
	capacityLiters: number; // ظرفیت بر حسب لیتر

	@Column({ type: 'varchar', length: 100, nullable: true })
	material: string; // جنس

	@Column({ type: 'boolean', default: false })
	isWaterproof: boolean; // ضدآب بودن
}
