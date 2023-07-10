import {Member} from "@/features/members/model/member.entity";

export type AuthorDto = {
  id: number;
  penName: string;
  joinedAt: Date;
};

export class MemberMapper {
  toAuthor(entity: Member): AuthorDto {
    const {id, penName, createdAt} = entity;
    return {id, penName, joinedAt: createdAt};
  }
}
