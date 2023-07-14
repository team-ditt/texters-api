import {FlowChartLock} from "@/features/locks/model/flow-chart-lock.entity";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {randomUUID} from "crypto";
import {Repository} from "typeorm";

@Injectable()
export class LocksService {
  constructor(
    @InjectRepository(FlowChartLock)
    private readonly flowChartLockRepository: Repository<FlowChartLock>,
  ) {}

  async lockFlowChart(bookId: number) {
    const key = randomUUID();
    return await this.flowChartLockRepository.save(FlowChartLock.of(bookId, key));
  }

  async canEditFlowChart(id: number, key: string) {
    const lock = await this.flowChartLockRepository.findOne({where: {id}});
    return lock.key === key;
  }
}
