import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class Review {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'int', width: 1 })
	rating: number; // 1–5 stars

	@Column({ type: 'text', nullable: true })
	comment?: string;

	@ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
	user: User;

	@ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE' })
	product: Product;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
