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
};

export type TextersExceptionKey = keyof typeof EXCEPTIONS;
