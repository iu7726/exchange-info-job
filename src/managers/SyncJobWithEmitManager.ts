import { JobManager } from "libs-job-manager";
import { OkxBalanceJob, BalanceJobRequest, BalanceJobResult } from "src/jobs/OkxBalanceJob";

export class SyncJobWithEmitManager extends JobManager<BalanceJobRequest, BalanceJobResult, OkxBalanceJob> {
  constructor(private readonly emit: (jobResult: any) => void) {
    super();
  }

  onResult(jobResult: any): void {
    this.emit(jobResult);
  }
}
