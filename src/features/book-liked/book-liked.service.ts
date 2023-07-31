import {BookLiked} from "@/features/book-liked/model/book-liked.entity";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class BookLikedService {
  constructor(
    @InjectRepository(BookLiked) private readonly bookLikedRepository: Repository<BookLiked>,
  ) {}

  async toggleBookLiked(memberId: number, bookId: number) {
    const bookLiked = await this.bookLikedRepository.findOne({where: {memberId, bookId}});
    if (!bookLiked) return await this.createBookLiked(memberId, bookId);
    return await this.removeBookLiked(bookLiked);
  }

  async isLiked(memberId: number, bookId: number) {
    return await this.bookLikedRepository.exist({where: {memberId, bookId}});
  }

  async removeAllByBookId(bookId: number) {
    const bookLiked = await this.bookLikedRepository.find({where: {bookId}});
    await Promise.all(bookLiked.map(like => this.removeBookLiked(like)));
  }

  async removeAllByMemberId(memberId: number) {
    const bookLiked = await this.bookLikedRepository.find({where: {memberId}});
    await Promise.all(bookLiked.map(like => this.removeBookLiked(like)));
  }

  private async createBookLiked(memberId, bookId) {
    await this.bookLikedRepository.save(BookLiked.of(memberId, bookId));
    return true;
  }

  async removeBookLiked(bookLiked: BookLiked) {
    await this.bookLikedRepository.remove(bookLiked);
    return false;
  }
}
