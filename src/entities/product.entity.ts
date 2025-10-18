// src/entities/product.entity.ts
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
	TableInheritance,
} from 'typeorm';
import { User } from './user.entity';
import { Brand } from './brand.entity';
import { Review } from './review.entity';
import { Like } from './like.entity';
import { FavoriteList } from './favorite-list.entity';
import { OrderItem } from './order-item.entity';
import { Image } from './image.entity';

@Entity('products')
@TableInheritance({
	// 💡 تعریف ستون Discriminator مستقیماً در اینجا
	column: { name: 'type', type: 'varchar' },
})
export class Product {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 255 })
	name: string;

	@Column({ type: 'text', nullable: true })
	description: string;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	price: number;

	@Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
	discountPercent: number; // مطابق با نیاز قبلی شما (Decimal)

	@Column({ type: 'int', default: 0 })
	stock: number;

	@Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
	averageRating: number; // آپدیت خودکار پس از هر Review

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	// Relations

	// 1. One-to-Many with Review
	@OneToMany(() => Review, (review) => review.product)
	reviews: Review[];

	// 2. One-to-Many with Like
	@OneToMany(() => Like, (like) => like.product)
	likes: Like[];

	// 3. One-to-Many with FavoriteList
	@OneToMany(() => FavoriteList, (favoriteList) => favoriteList.product)
	favoriteLists: FavoriteList[];

	// 4. One-to-Many with OrderItem (برای ردیابی خریدها)
	@OneToMany(() => OrderItem, (orderItem) => orderItem.product)
	orderItems: OrderItem[];

	@OneToMany(() => Image, (image) => image.product)
	images: Image[];

	// 5. Many-to-One with Brand
	@Column({ type: 'varchar', length: 255, nullable: true })
	brand: string;

	creator: User;

	// Getter for final price
	get finalPrice(): number {
		return this.price * (1 - this.discountPercent / 100);
	}
}
