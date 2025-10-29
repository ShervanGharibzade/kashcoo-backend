import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AdminRole {
	ADMIN = 'admin',
	SUPER_ADMIN = 'super_admin',
}

@Entity('admins')
export class Admin {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 50 })
	fullName: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	/** نقش ادمین (فقط admin یا super_admin مجازند) */
	@Column({
		type: 'enum',
		enum: AdminRole,
		default: AdminRole.ADMIN,
	})
	role: AdminRole;

	/** فعال بودن یا مسدود شدن حساب ادمین */
	@Column({ default: true })
	isActive: boolean;

	/** توکن رفرش (اختیاری، برای امنیت بیشتر) */
	@Column({ nullable: true })
	token: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
