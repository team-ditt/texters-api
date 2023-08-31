import {Injectable} from "@nestjs/common";
import {DataSource} from "typeorm";

@Injectable()
export class AdminService {
  constructor(private readonly dataSource: DataSource) {}

  async collectNewUsersStatistics(days: number) {
    return await this.dataSource.createEntityManager().query(`
      SELECT
      DATE_TRUNC('day', "createdAt" AT TIME ZONE 'Asia/Seoul') AS day,
      COUNT(*) AS count
      FROM
          member
      WHERE
          "createdAt" >= NOW() - INTERVAL '1 week'
      GROUP BY
          day
      ORDER BY
          day DESC
      LIMIT
      ${days};
    `);
  }

  async collectNewBooksStatistics(days: number) {
    return await this.dataSource.createEntityManager().query(`
      SELECT
      DATE_TRUNC('day', "createdAt" AT TIME ZONE 'Asia/Seoul') AS day,
      COUNT(*) AS count
      FROM
          book
      WHERE
          "createdAt" >= NOW() - INTERVAL '1 week'
      GROUP BY
          day
      ORDER BY
          day DESC
      LIMIT
      ${days};
    `);
  }
}
