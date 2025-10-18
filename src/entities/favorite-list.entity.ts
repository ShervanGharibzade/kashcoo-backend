import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
@Unique(['user', 'product'])
export class FavoriteList {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.favoriteLists, { onDelete: 'CASCADE' })
	user: User;

	@ManyToOne(() => Product, (product) => product.favoriteLists, { onDelete: 'CASCADE' })
	product: Product;

	@CreateDateColumn()
	createdAt: Date;
}
