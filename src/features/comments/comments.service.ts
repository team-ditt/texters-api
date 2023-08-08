import {BooksService} from "@/features/books/books.service";
import {Comment} from "@/features/comments/model/comment.entity";
import {CreateCommentDto} from "@/features/comments/model/create-comment.dto";
import {TextersHttpException} from "@/features/exceptions/texters-http.exception";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class CommentsService {
  constructor(
    private readonly booksService: BooksService,
    @InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>,
  ) {}

  async createComment(
    bookId: number,
    commenterId: number,
    commenterName: string,
    createCommentDto: CreateCommentDto,
  ) {
    const book = await this.booksService.findBookById(bookId);
    if (!book.isPublished()) throw new TextersHttpException("CANNOT_COMMENT_ON_UNPUBLISHED_BOOK");

    const comment = Comment.of(
      book.id,
      commenterId,
      commenterName,
      createCommentDto.isSpoiler,
      createCommentDto.content,
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
}
