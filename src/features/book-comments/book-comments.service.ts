import {BookComment} from "@/features/book-comments/model/book-comment.entity";
import {CreateBookCommentDto} from "@/features/book-comments/model/create-book-comment.dto";
import {BooksService} from "@/features/books/books.service";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class BookCommentsService {
  constructor(
    private readonly booksService: BooksService,
    @InjectRepository(BookComment) private readonly commentsRepository: Repository<BookComment>,
  ) {}

  async createComment(
    bookId: number,
    commenterId: number,
    commenterName: string,
    createBookCommentDto: CreateBookCommentDto,
  ) {
    const book = await this.booksService.findBookById(bookId);
    if (!book.isPublished()) throw new TextersHttpException("CANNOT_COMMENT_ON_UNPUBLISHED_BOOK");

    const comment = BookComment.of(
      book.id,
      commenterId,
      commenterName,
      createBookCommentDto.isSpoiler,
      createBookCommentDto.content,
    );

    const {id} = await this.commentsRepository.save(comment);
    return await this.commentsRepository.findOne({
      where: {id},
      relations: {
        book: {author: true},
        commenter: true,
      },
    });
  }

  async findComments(bookId: number, page: number, limit: number) {
    const [comments, totalCount] = await this.commentsRepository.findAndCount({
      where: {bookId},
      relations: {book: {author: true}, commenter: true},
      order: {createdAt: "DESC"},
      take: limit,
      skip: (page - 1) * limit,
    });

    return {comments, totalCount};
  }

  async deleteCommentById(id: number) {
    const comment = await this.commentsRepository.findOne({where: {id}});
    if (!comment) throw new TextersHttpException("COMMENT_NOT_FOUND");

    await this.commentsRepository.remove(comment);
  }

  async isCommenter(memberId: number, commentId: number) {
    const comment = await this.commentsRepository.findOne({where: {id: commentId}});
    if (!comment) throw new TextersHttpException("COMMENT_NOT_FOUND");
    return comment.commenterId === memberId;
  }
}
