export interface BatchMulticallConfig {
  gasLimitOverride: number
  multicallChunk: number
}

export interface BatchMulticallConfigs {
  defaultConfig: BatchMulticallConfig
  gasErrorFailureOverride: BatchMulticallConfig
  successRateFailureOverrides: BatchMulticallConfig
}
