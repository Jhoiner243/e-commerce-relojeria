import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Buffer } from 'buffer';
import { JwtGuard } from '../common/guards/jwt.guard';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/login.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const admin = await this.adminService.validateAdmin(
      body.email,
      body.password,
    );

    const tokenPayload = Buffer.from(JSON.stringify(admin)).toString(
      'base64url',
    );
    return { access_token: tokenPayload };
  }

  @UseGuards(JwtGuard)
  @Get('me')
  me() {
    return { ok: true };
  }
}
