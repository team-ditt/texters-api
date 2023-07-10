import {BadRequestException} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import {extname} from "path";

export function CoverImageInterceptor(fieldName: string) {
  const ACCEPTABLE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
  const MAXIMUM_FILE_SIZE = 5 * 1024 * 1024;
  return FileInterceptor(fieldName, {
    fileFilter: (_, file, callback) => {
      const ext = extname(file.originalname);
      if (!ACCEPTABLE_EXTENSIONS.includes(ext))
        return callback(new BadRequestException("Not allowed image format"), false);
      callback(null, true);
    },
    limits: {fileSize: MAXIMUM_FILE_SIZE},
  });
}
