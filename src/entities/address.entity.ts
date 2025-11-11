import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Address {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
	user: User;

	@Column({ type: 'varchar', length: 255 })
	fullName: string; // recipient name

	@Column({ type: 'varchar', length: 20, nullable: true })
	phone?: string; // optional phone number

	@Column({ type: 'varchar', length: 100 })
	province: string;

	@Column({ type: 'varchar', length: 100 })
	city: string;

	@Column({ type: 'varchar', length: 255 })
	street: string;

	@Column({ type: 'varchar', length: 20, nullable: true })
	postalCode?: string;

	@Column({ type: 'boolean', default: false })
	isDefault: boolean; // default shipping address

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
