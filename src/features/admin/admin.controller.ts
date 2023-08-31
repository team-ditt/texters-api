import {AdminService} from "@/features/admin/admin.service";
import {AuthGuard} from "@/features/auth/auth.guard";
import {Roles} from "@/features/roles/roles.decorator";
import {RolesGuard} from "@/features/roles/roles.guard";
import {Controller, Get, Query, UseGuards} from "@nestjs/common";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("/statistics/new-users")
  @Roles("admin")
  @UseGuards(AuthGuard, RolesGuard)
  getNewUsersStatistics(@Query() {days = 7}: {days: number}) {
    return this.adminService.collectNewUsersStatistics(days);
  }

  @Get("/statistics/new-books")
  @Roles("admin")
  @UseGuards(AuthGuard, RolesGuard)
  getNewBooksStatistics(@Query() {days = 7}: {days: number}) {
    return this.adminService.collectNewBooksStatistics(days);
  }
}
