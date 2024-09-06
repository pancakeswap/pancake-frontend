import { DASHBOARD_ALLOW_LIST } from 'config/constants/dashboardAllowList'

import { ExtendedApiHandler } from './withSiwe'

export function withDashboardAllowlistAuth(handler: ExtendedApiHandler): ExtendedApiHandler {
  return (req, res) => {
    const {
      siwe: { address },
    } = req
    if (!address || !DASHBOARD_ALLOW_LIST.includes(address)) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    return handler(req, res)
  }
}
