import {Member, MemberRole} from "@/features/members/model/member.entity";

export type AuthorDto = {
  id: number;
  penName: string;
  role: MemberRole;
  joinedAt: Date;
};

export class MemberMapper {
  toAuthor(entity: Member): AuthorDto {
    const {id, penName, role, createdAt} = entity;
    return {id, penName, role, joinedAt: createdAt};
  }
}
