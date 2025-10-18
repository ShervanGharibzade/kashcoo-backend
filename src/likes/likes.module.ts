import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { Like } from '../entities/like.entity';
import { Product } from '../entities/product.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Like, Product])],
	controllers: [LikesController],
	providers: [LikesService],
})
export class LikesModule {}
