import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// 🧩 Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { LikesModule } from './likes/likes.module';
import { FavoriteListModule } from './favorite-list/favorite-list.module';

// 🧱 Entities
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import { Product } from './entities/product.entity';
import { Backpack } from './entities/backpack.entity';
import { Brand } from './entities/brand.entity';
import { Image } from './entities/image.entity';
import { Review } from './entities/review.entity';
import { Like } from './entities/like.entity';
import { FavoriteList } from './entities/favorite-list.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { AdminModule } from './admin/admin.module';

@Module({
	imports: [
		// 🗂 TypeORM connection config
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST || 'localhost',
			port: parseInt(process.env.DB_PORT ?? '5432', 10),
			username: process.env.DB_USER || 'postgres',
			password: process.env.DB_PASS || 'postgres',
			database: process.env.DB_NAME || 'backpack_db',
			entities: [User, Token, Product, Backpack, Brand, Image, Review, Like, FavoriteList, Order, OrderItem],
			synchronize: true, // ❗ در محیط production حتما false کن
		}),

		ScheduleModule.forRoot(),

		// 📦 Feature modules
		AuthModule,
		UsersModule,
		ProductsModule,
		OrdersModule,
		ReviewsModule,
		LikesModule,
		FavoriteListModule,
		AdminModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
