import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from '../entities/review.entity';
import { Product } from '../entities/product.entity';
import { OrderItem } from '../entities/order-item.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Review, Product, OrderItem])],
	controllers: [ReviewsController],
	providers: [ReviewsService],
})
export class ReviewsModule {}
