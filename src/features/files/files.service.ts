import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {File} from "@/features/files/model/file.entity";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {InjectRepository} from "@nestjs/typeorm";
import * as sharp from "sharp";
import {Repository} from "typeorm";

@Injectable()
export class FilesService {
  private s3: S3Client;
  private bucket: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(File) private readonly filesRepository: Repository<File>,
  ) {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID"),
        secretAccessKey: this.configService.get<string>("AWS_SECRET_ACCESS_KEY"),
      },
      region: this.configService.get<string>("S3_REGION"),
    });
    this.bucket = this.configService.get<string>("S3_BUCKET");
  }

  async uploadCoverImage(image: Express.Multer.File) {
    const {extension, buffer} = await this.refineImage(image);

    const directory = "books/cover";
    const {uuid} = await this.filesRepository.save(File.of(directory, extension));
    try {
      await this.tryUploadBufferToS3Bucket(`${directory}/${uuid}.${extension}`, buffer);
    } catch {
      await this.filesRepository.delete(uuid);
      throw new TextersHttpException("FAILED_UPLOAD_TO_AWS");
    }
    return {coverImageId: uuid};
  }

  async findById(uuid: string) {
    return await this.filesRepository.findOne({where: {uuid}});
  }

  private async refineImage(image: Express.Multer.File) {
    const targetWidth = 667;
    const targetHeight = 1000;
    const targetExtension = "webp";
    return {
      extension: targetExtension,
      buffer: await sharp(image.buffer)
        .resize(targetWidth, targetHeight, {fit: "cover"})
        .toFormat(targetExtension)
        .toBuffer(),
    };
  }

  private async tryUploadBufferToS3Bucket(key: string, buffer: Buffer) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
    });
    await this.s3.send(command);
  }
}
