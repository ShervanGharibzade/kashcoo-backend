// brand.entity.ts
// ...
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity'; // باید Product را Import کنید

@Entity()
export class Brand {
	@PrimaryGeneratedColumn()
	id: number;
	// ...
	@Column({ unique: true })
	name: string;

	// 🚨 اضافه کردن فیلد products:
	@OneToMany(() => Product, (product) => product.brand)
	products: Product[]; // نام این فیلد باید با 'brand.products' تطابق داشته باشد
}
