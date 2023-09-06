export type BatchMulticallConfig = {
  gasLimitPerCall: number
}

export type BatchMulticallConfigs = {
  defaultConfig: BatchMulticallConfig
  gasErrorFailureOverride: BatchMulticallConfig
  successRateFailureOverrides: BatchMulticallConfig
}
