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
  NOT_AUTHOR_OF_BOOK: {
    code: 1007,
    statusCode: HttpStatus.FORBIDDEN,
    message: "작가 본인이 아니면 작품을 수정할 수 없습니다.",
  },
  ORDER_INDEX_OUT_OF_BOUND: {
    code: 1008,
    statusCode: HttpStatus.BAD_REQUEST,
    message: "올바르지 않은 order 값입니다.",
  },
  LANE_NOT_FOUND: {
    code: 1009,
    statusCode: HttpStatus.NOT_FOUND,
    message: "레인을 찾을 수 없습니다.",
  },
  NO_EXPLICIT_INTRO_LANE_MODIFICATION: {
    code: 1011,
    statusCode: HttpStatus.BAD_REQUEST,
    message: "인트로 레인은 임의로 생성하거나 삭제할 수 없습니다.",
  },
  NOT_EMPTY_LANE: {
    code: 1012,
    statusCode: HttpStatus.BAD_REQUEST,
    message: "하위 페이지가 있는 레인은 삭제할 수 없습니다.",
  },
  PAGE_NOT_FOUND: {
    code: 1013,
    statusCode: HttpStatus.NOT_FOUND,
    message: "페이지를 찾을 수 없습니다.",
  },
  TOO_MANY_CHOICES: {
    code: 1014,
    statusCode: HttpStatus.BAD_REQUEST,
    message: "선택지는 페이지당 최대 5개까지 만들 수 있습니다.",
  },
  CHOICE_NOT_FOUND: {
    code: 1015,
    statusCode: HttpStatus.BAD_REQUEST,
    message: "선택지를 찾을 수 없습니다.",
  },
  NO_EXPLICIT_INTRO_PAGE_DELETION: {
    code: 1016,
    statusCode: HttpStatus.BAD_REQUEST,
    message: "인트로 페이지는 임의로 삭제할 수 없습니다.",
  },
  NO_EXPLICIT_INTRO_PAGE_MOVE: {
    code: 1018,
    statusCode: HttpStatus.BAD_REQUEST,
    message: "인트로 페이지는 이동할 수 없습니다.",
  },
  LOCKED_FLOW_CHART: {
    code: 1022,
    statusCode: HttpStatus.CONFLICT,
    message: "다른 클라이언트에서 작품을 수정 중입니다. 새로고침해주세요.",
  },
  NOT_AUTHORIZED_MEMBER: {
    code: 1023,
    statusCode: HttpStatus.FORBIDDEN,
    message: "작업을 수행할 권한이 없어요!",
  },
  INVALID_PAGE_PARAM: {
    code: 1027,
    statusCode: HttpStatus.BAD_REQUEST,
    message: "잘못된 페이지 번호입니다.",
  },
  INTERNAL_SERVER_ERROR: {
    code: 1029,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: "작업 도중 서버에서 오류가 발생했습니다.",
  },
  INVALID_REFRESH_TOKEN: {
    code: 1031,
    statusCode: HttpStatus.UNAUTHORIZED,
    message: "세션이 만료되었어요. 다시 로그인해주세요.",
  },
  MEMBER_NOT_FOUND: {
    code: 1032,
    statusCode: HttpStatus.NOT_FOUND,
    message: "회원을 찾을 수 없어요.",
  },
  CANNOT_WITHDRAW_NOT_EMPTY_DASHBOARD: {
    code: 1033,
    statusCode: HttpStatus.BAD_REQUEST,
    message: "삭제하지 않은 작품이 있어 탈퇴할 수 없어요.",
  },
  CANNOT_COMMENT_ON_UNPUBLISHED_BOOK: {
    code: 1034,
    statusCode: HttpStatus.BAD_REQUEST,
    message: "공개되지 않은 작품에는 댓글을 달 수 없어요.",
  },
  NOT_COMMENTER: {
    code: 1035,
    statusCode: HttpStatus.FORBIDDEN,
    message: "댓글 작성자가 아니면 댓글을 지울 수 없어요!",
  },
  COMMENT_NOT_FOUND: {
    code: 1036,
    statusCode: HttpStatus.NOT_FOUND,
    message: "댓글을 찾을 수 없어요!",
  },
  DUPLICATE_BOARD_ID: {
    code: 1037,
    statusCode: HttpStatus.CONFLICT,
    message: "이미 존재하는 게시판 ID에요!",
  },
  BOARD_NOT_FOUND: {
    code: 1038,
    statusCode: HttpStatus.NOT_FOUND,
    message: "게시판을 찾을 수 없어요!",
  },
  NO_UNAUTHENTICATED_HIDDEN_THREAD_CREATION: {
    code: 1039,
    statusCode: HttpStatus.UNAUTHORIZED,
    message: "비회원은 비공개 스레드를 작성할 수 없어요!",
  },
  NOT_AUTHORIZED_TO_VIEW_HIDDEN_THREAD: {
    code: 1040,
    statusCode: HttpStatus.FORBIDDEN,
    message: "비공개 스레드는 작성자 본인과 운영진만 확인할 수 있어요!",
  },
  THREAD_NOT_FOUND: {
    code: 1041,
    statusCode: HttpStatus.NOT_FOUND,
    message: "스레드를 찾을 수 없어요!",
  },
  WRONG_THREAD_PASSWORD: {
    code: 1042,
    statusCode: HttpStatus.FORBIDDEN,
    message: "올바른 스레드 비밀번호를 입력해주세요!",
  },
  NOT_AUTHOR_OF_THREAD: {
    code: 1043,
    statusCode: HttpStatus.FORBIDDEN,
    message: "스레드를 수정/삭제할 권한이 없어요!",
  },
  WRONG_COMMENT_PASSWORD: {
    code: 1044,
    statusCode: HttpStatus.FORBIDDEN,
    message: "올바른 댓글 비밀번호를 입력해주세요!",
  },
  NOT_AUTHOR_OF_THREAD_COMMENT: {
    code: 1045,
    statusCode: HttpStatus.FORBIDDEN,
    message: "댓글을 수정/삭제할 권한이 없어요!",
  },
  THREAD_LIKED_IN_PAST_24_HOURS: {
    code: 1046,
    statusCode: HttpStatus.BAD_REQUEST,
    message: "추천은 24시간에 1번만 누를 수 있어요!",
  },
};

export type TextersExceptionKey = keyof typeof EXCEPTIONS;
