import {Page} from "@/features/pages/model/page.entity";
import {Injectable} from "@nestjs/common";
import * as R from "ramda";

@Injectable()
export class PageMapper {
  constructor() {}

  toResponse(entity: Page) {
    const isIntro = entity.lane?.order === 0 && entity.order === 0;
    const isEnding = entity.choices.length === 0;
    return R.pipe(
      R.omit(["lane"]),
      R.assoc("isIntro", isIntro),
      R.assoc("isEnding", isEnding),
    )(entity);
  }
}
