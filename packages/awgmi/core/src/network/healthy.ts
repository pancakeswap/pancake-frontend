import { getProvider } from '../providers'

export type FetchHealthyArgs = {
  networkName?: string
  durationSecs?: number
}

export type FetchHealthyResult = ReturnType<typeof fetchHealthy>

export async function fetchHealthy({ networkName, durationSecs }: FetchHealthyArgs) {
  const provider = getProvider({ networkName })
  const healthy = provider.client.general.healthy(durationSecs)
  return healthy
}
