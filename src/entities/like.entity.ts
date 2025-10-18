import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
@Unique(['user', 'product'])
export class Like {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
	user: User;

	@ManyToOne(() => Product, (product) => product.likes, { onDelete: 'CASCADE' })
	product: Product;

	@CreateDateColumn()
	createdAt: Date;
}
