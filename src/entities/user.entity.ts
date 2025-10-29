import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Review } from './review.entity';
import { Like } from './like.entity';
import { FavoriteList } from './favorite-list.entity';
import { Token } from './token.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'varchar',
		default: 'user',
	})
	role: 'user';

	@Column()
	firstName: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column()
	lastName: string;

	@Column({ unique: true })
	phoneNumber: string;

	@OneToMany(() => Order, (order) => order.user)
	orders: Order[];

	@OneToMany(() => Review, (review) => review.user)
	reviews: Review[];

	@OneToMany(() => Like, (like) => like.user)
	likes: Like[];

	@OneToMany(() => FavoriteList, (fav) => fav.user)
	favoriteLists: FavoriteList[];

	@OneToOne(() => Token, (token) => token.user)
	token: Token;
}
