import {FilesController} from "@/features/files/files.controller";
import {FilesService} from "@/features/files/files.service";
import {File} from "@/features/files/model/file.entity";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
