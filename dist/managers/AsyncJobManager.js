"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncJobManager = void 0;
const libs_job_manager_1 = require("libs-job-manager");
class AsyncJobManager extends libs_job_manager_1.JobManager {
    constructor() {
        super();
        this.setMode(libs_job_manager_1.Mode.Async);
    }
    onResult(jobResult) {
        if (!jobResult) {
        }
    }
}
exports.AsyncJobManager = AsyncJobManager;
