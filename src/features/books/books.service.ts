import {BookFilteredView} from "@/features/books/model/book-filtered-view.entity";
import {Book} from "@/features/books/model/book.entity";
import {CreateBookDto} from "@/features/books/model/create-book-request.dto";
import {UpdateBookDto} from "@/features/books/model/update-book-request.dto";
import {FilesService} from "@/features/files/files.service";
import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {omit} from "rambda";
import {Repository} from "typeorm";

@Injectable()
export class BooksService {
  constructor(
    private readonly filesService: FilesService,
    @InjectRepository(Book) private readonly booksRepository: Repository<Book>,
    @InjectRepository(BookFilteredView)
    private readonly filteredBooksRepository: Repository<BookFilteredView>,
  ) {}

  async saveBook(authorId: number, createBookDto: CreateBookDto): Promise<Book> {
    const {title, description, coverImageId} = createBookDto;

    const book = Book.of(title, description);
    book.authorId = authorId;
    book.coverImage = await this.findCoverImage(coverImageId);

    const {id} = await this.booksRepository.save(book);
    return await this.readBook(id);
  }

  private async findCoverImage(uuid: string | undefined) {
    return uuid ? await this.filesService.findOne({uuid}) : undefined;
  }

  async readBook(id: number): Promise<BookFilteredView> {
    const book = await this.filteredBooksRepository.findOne({
      where: {id},
      relations: ["author", "coverImage"],
    });
    if (!book) throw new BadRequestException("Wrong book id provided");
    return book;
  }

  async updateBook(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.booksRepository.findOne({where: {id}});
    if (!book) throw new BadRequestException("Wrong book id provided");

    Object.assign(book, omit(["coverImageId"], updateBookDto));
    book.coverImage = await this.findCoverImage(updateBookDto.coverImageId);

    await this.booksRepository.save(book);
    return await this.readBook(id);
  }

  async deleteBook(id: number): Promise<void> {
    const book = await this.booksRepository.findOne({where: {id}});
    if (!book) throw new BadRequestException("Wrong book id provided");

    book.status = "DELETED";
    await this.booksRepository.save(book);
  }

  async isAuthor(memberId: number, bookId: number): Promise<boolean> {
    const book = await this.booksRepository.findOne({where: {id: bookId}});
    return book.authorId === memberId;
  }
}
