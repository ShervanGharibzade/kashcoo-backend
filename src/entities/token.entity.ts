import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

// 🟢 token.entity.ts
@Entity()
export class Token {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	token: string;

	@Column()
	expiresAt: Date;

	@Column({ default: false })
	revoked: boolean;

	@Column()
	userId: number;

	@OneToOne(() => User, (user) => user.token, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user: User;
}
