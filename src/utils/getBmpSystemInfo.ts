import mpService from '@binance/mp-service'

let systemInfo
export const getSystemInfoSync = () => {
  if (!systemInfo) {
    systemInfo = mpService.getSystemInfoSync()
  }
  return systemInfo
}
