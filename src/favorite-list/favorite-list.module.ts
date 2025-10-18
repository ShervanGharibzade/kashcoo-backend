import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteList } from '../entities/favorite-list.entity';
import { Product } from '../entities/product.entity';
import { FavoriteListController } from './favorite-list.controller';
import { FavoriteListService } from './favorite-list.service';

@Module({
	imports: [TypeOrmModule.forFeature([FavoriteList, Product])],
	controllers: [FavoriteListController],
	providers: [FavoriteListService],
})
export class FavoriteListModule {}
