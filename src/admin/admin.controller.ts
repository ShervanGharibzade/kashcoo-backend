import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminAuthService } from './admin-auth.service';
import { AdminCreateDto } from './dto/admin-create.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { AdminRole } from './admin.entity';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('admin')
// @UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
	constructor(
		private readonly adminService: AdminService,
		private readonly adminAuthService: AdminAuthService,
	) {}

	// Auth endpoints
	@Post('auth/login')
	login(@Body() dto: AdminLoginDto) {
		return this.adminAuthService.login(dto);
	}

	// Admin management (SUPER_ADMIN only)
	@Post('admins')
	@Roles(AdminRole.SUPER_ADMIN)
	createAdmin(@Body() dto: AdminCreateDto, @Req() req: Request) {
		const operatorId = (req.user as any)?.sub;
		return this.adminAuthService.createAdmin(dto, operatorId);
	}

	@Get('admins')
	@Roles(AdminRole.SUPER_ADMIN)
	getAdmins() {
		return this.adminService.findAllAdmins();
	}

	@Patch('admins/:id/activate')
	@Roles(AdminRole.SUPER_ADMIN)
	activate(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
		const operatorId = (req.user as any)?.sub;
		return this.adminService.toggleAdminActivation(id, operatorId, true);
	}

	@Patch('admins/:id/deactivate')
	@Roles(AdminRole.SUPER_ADMIN)
	deactivate(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
		const operatorId = (req.user as any)?.sub;
		return this.adminService.toggleAdminActivation(id, operatorId, false);
	}

	@Delete('admins/:id')
	@Roles(AdminRole.SUPER_ADMIN)
	remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
		const operatorId = (req.user as any)?.sub;
		return this.adminService.deleteAdmin(id, operatorId);
	}

	@Post(':id/images')
	@Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads/products',
				filename: (req, file, cb) => {
					const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
					cb(null, unique + extname(file.originalname));
				},
			}),
		}),
	)
	uploadImage(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
		return this.adminService.uploadProductImage(id, file);
	}

	@Patch(':productId/images/:imageId/set-main')
	@Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
	setMainImage(@Param('productId') pid: number, @Param('imageId') iid: number) {
		return this.adminService.setMainImage(pid, iid);
	}

	@Delete('images/:id')
	@Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
	deleteImage(@Param('id') id: number) {
		return this.adminService.deleteImage(id);
	}
}
