import {HttpStatus} from "@nestjs/common";

export const EXCEPTIONS = {
  NOT_REGISTERED: {
    code: 1000,
    statusCode: HttpStatus.NOT_FOUND,
    message: "등록된 회원정보가 없습니다.",
    error: "소셜로그인 계정과 연동된 회원정보가 없습니다. 회원가입을 먼저 진행해주세요.",
  },
  ALREADY_REGISTERED: {
    code: 1001,
    statusCode: HttpStatus.CONFLICT,
    message: "이미 등록된 회원입니다.",
    error: "소셜로그인 계정과 연동된 회원정보가 있습니다.",
  },
  INVALID_AUTH_TOKEN: {
    code: 1002,
    statusCode: HttpStatus.UNAUTHORIZED,
    message: "올바르지 않은 인증 토큰입니다.",
  },
  DUPLICATE_PEN_NAME: {
    code: 1003,
    statusCode: HttpStatus.CONFLICT,
    message: "중복된 필명입니다.",
  },
  FAILED_UPLOAD_TO_AWS: {
    code: 1004,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "파일 업로드에 실패했습니다.",
  },
  BOOK_NOT_FOUND: {
    code: 1005,
    statusCode: HttpStatus.NOT_FOUND,
    message: "작품을 찾을 수 없습니다.",
  },
  INVALID_FORM: {
    code: 1006,
    statusCode: HttpStatus.BAD_REQUEST,
    message: "누락되거나 잘못된 항목이 있습니다.",
  },
  NOT_AUTHOR: {
    code: 1007,
    statusCode: HttpStatus.FORBIDDEN,
    message: "로그인 사용자와 작품의 작가가 일치하지 않습니다.",
  },
  ORDER_INDEX_OUT_OF_BOUND: {
    code: 1008,
    statusCode: HttpStatus.BAD_REQUEST,
    message: "올바르지 않은 order 값입니다.",
  },
  LANE_NOT_FOUND: {
    code: 1006,
    statusCode: HttpStatus.NOT_FOUND,
    message: "레인을 찾을 수 없습니다.",
  },
  TOO_MANY_PAGES: {
    code: 1007,
    statusCode: HttpStatus.BAD_REQUEST,
    message: "페이지는 작품당 최대 100개까지 만들 수 있습니다.",
  },
  NO_EXPLICIT_INTRO_LANE_MODIFICATION: {
    code: 1008,
    statusCode: HttpStatus.BAD_REQUEST,
    message: "인트로 레인은 임의로 생성하거나 삭제할 수 없습니다.",
  },
  NOT_EMPTY_LANE: {
    code: 1009,
    statusCode: HttpStatus.BAD_REQUEST,
    message: "하위 페이지가 있는 레인은 삭제할 수 없습니다.",
  },
  PAGE_NOT_FOUND: {
    code: 1010,
    statusCode: HttpStatus.NOT_FOUND,
    message: "페이지를 찾을 수 없습니다.",
  },
};

export type TextersExceptionKey = keyof typeof EXCEPTIONS;
