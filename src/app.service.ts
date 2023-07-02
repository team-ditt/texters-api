import {Injectable} from "@nestjs/common";

@Injectable()
export class AppService {
  getIndex(): string {
    return "Online Grocery Store API";
  }
}
