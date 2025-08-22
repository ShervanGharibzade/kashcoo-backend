import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { OrderController } from './order/order.controller';
import { OrderModule } from './order/order.module';
import { OrdrItemsService } from './ordr-items/ordr-items.service';
import { OrderItemsService } from './order-items/order-items.service';
import { OrderItemsModule } from './order-items/order-items.module';
import { RatingsController } from './ratings/ratings.controller';
import { ProductsModule } from './products/products.module';
import { ProductsController } from './products/products.controller';
import { FavoritesModule } from './favorites/favorites.module';
import { FavoritesService } from './favorites/favorites.service';
import { RatingsModule } from './ratings/ratings.module';
import { RatingsController } from './ratings/ratings.controller';

@Module({
  imports: [UserModule, AuthModule, OrderModule, OrderItemsModule, RatingsModule, FavoritesModule, ProductsModule],
  controllers: [AppController, UserController, OrderController, RatingsController, ProductsController],
  providers: [AppService, AuthService, OrdrItemsService, OrderItemsService, FavoritesService],
})
export class AppModule {}
