import {CoverImageInterceptor} from "@/features/files/files.interceptor";
import {FilesService} from "@/features/files/files.service";
import {AuthGuard} from "@/features/shared/auth.guard";
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("books/cover")
  @UseGuards(AuthGuard)
  @UseInterceptors(CoverImageInterceptor("image"))
  @HttpCode(HttpStatus.OK)
  uploadCoverImage(@UploadedFile() image: Express.Multer.File) {
    return this.filesService.uploadCoverImage(image);
  }
}
