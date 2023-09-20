export type BatchMulticallConfig = {
  gasLimitPerCall: number
  dropUnexecutedCalls?: boolean
}

export type BatchMulticallConfigs = {
  defaultConfig: BatchMulticallConfig
  gasErrorFailureOverride: BatchMulticallConfig
  successRateFailureOverrides: BatchMulticallConfig
}
