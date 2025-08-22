import { Product } from "src/products/products.entity";
import { User } from "src/user/user.entity";
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

// favorite.entity.ts
@Entity("favorites")
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favorites)
  user: User;

  @ManyToOne(() => Product, (product) => product.favorites)
  product: Product;

  @CreateDateColumn()
  createdAt: Date;
}
