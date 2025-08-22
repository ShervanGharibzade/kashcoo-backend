// product.entity.ts
import { Favorite } from "src/favorites/favorites.entity";
import { OrderItem } from "src/order-items/order-items.entity";
import { Rating } from "src/ratings/ratings.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column("decimal")
  price: number; // regular price

  @Column("decimal", { nullable: true })
  offPrice: number; // discount price

  @Column("int")
  stock: number;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(() => Rating, (rating) => rating.product)
  ratings: Rating[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => Favorite, (favorite) => favorite.product)
  favorites: Favorite[];

  @CreateDateColumn()
  createdAt: Date;
}
