import { Backpack } from './entities/backpack.entity';
import { Brand } from './entities/brand.entity';
import { Product } from './entities/product.entity';
import { Review } from './entities/review.entity';
import { Token } from './entities/token.entity';
import { User } from './entities/user.entity';
import { FavoriteList } from './entities/favorite-list.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Address } from './entities/address.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { LikesModule } from './likes/likes.module';
import { FavoriteListModule } from './favorite-list/favorite-list.module';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Like } from './entities/like.entity';
import { Admin } from './admin/admin.entity';
import { Image } from './entities/image.entity';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST || 'localhost',
			port: parseInt(process.env.DB_PORT ?? '5432', 10),
			username: process.env.DB_USER || 'postgres',
			password: process.env.DB_PASS || 'postgres',
			database: process.env.DB_NAME || 'backpack_db',
			entities: [
				User,
				Token,
				Product,
				Backpack,
				Brand,
				Image,
				Review,
				Like,
				FavoriteList,
				Order,
				OrderItem,
				Admin,
				Address, // ✅ already here
			],
			synchronize: true, // ❗ set false in production
		}),
		ScheduleModule.forRoot(),

		AuthModule,
		UsersModule, // ✅ UsersModule with Address repository
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
