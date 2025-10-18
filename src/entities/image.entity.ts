// src/entities/image.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('images')
export class Image {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 255 })
	url: string;

	// 💡 اضافه کردن فیلد isMain
	@Column({ type: 'boolean', default: false })
	isMain: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => Product, (product) => product.images)
	product: Product;
}
