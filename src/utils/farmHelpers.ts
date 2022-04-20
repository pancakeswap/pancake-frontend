const ARCHIVED_FARMS_START_PID = 139
const ARCHIVED_FARMS_END_PID = 250
export const isArchivedPid = (pid: number) => pid >= ARCHIVED_FARMS_START_PID && pid <= ARCHIVED_FARMS_END_PID

const ARCHIVED_FARMS_START_PID_V1 = 139
const ARCHIVED_FARMS_END_PID_V1 = 250
export const isArchivedPidV1 = (pid: number) => pid >= ARCHIVED_FARMS_START_PID_V1 && pid <= ARCHIVED_FARMS_END_PID_V1
