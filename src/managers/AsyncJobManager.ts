import { JobManager, Mode } from "libs-job-manager";
import { OkxBalanceJob, BalanceJobRequest, BalanceJobResult } from "src/jobs/OkxBalanceJob";
import { RebateJob, RebateJobRequest, RebateJobResult } from "src/jobs/RebateJob";
import { BillsJobRequest, BillsJobResult, BillsJob } from "src/jobs/BillsJob";

export class AsyncJobManager extends JobManager<
  BalanceJobRequest | RebateJobRequest | BillsJobRequest,
  BalanceJobResult | RebateJobResult | BillsJobResult,
  OkxBalanceJob | RebateJob | BillsJob
> {
  constructor() {
    super();
    this.setMode(Mode.Async);
  }

  onResult(jobResult: any): void {
    if (!jobResult) {
    }
  }
}
