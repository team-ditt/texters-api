import {EXCEPTIONS, TextersExceptionKey} from "@/features/exceptions/exceptions";
import {HttpException} from "@nestjs/common";
import {mergeRight} from "rambda";

export class TextersHttpException extends HttpException {
  constructor(key: TextersExceptionKey, data?: object) {
    const exception = EXCEPTIONS[key];
    super(mergeRight(exception, data), exception.statusCode);
  }
}
