import {FlowChartLock} from "@/features/locks/model/flow-chart-lock.entity";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {randomUUID} from "crypto";
import {Repository} from "typeorm";

@Injectable()
export class LocksService {
  constructor(
    @InjectRepository(FlowChartLock)
    private readonly flowChartLocksRepository: Repository<FlowChartLock>,
  ) {}

  async lockFlowChart(bookId: number) {
    const key = randomUUID();
    return await this.flowChartLocksRepository.save(FlowChartLock.of(bookId, key));
  }

  async canEditFlowChart(id: number, key: string) {
    const lock = await this.flowChartLocksRepository.findOne({where: {id}});
    return lock.key === key;
  }
}
