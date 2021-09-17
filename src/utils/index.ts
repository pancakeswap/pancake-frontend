import { BASE_BSC_SCAN_URLS } from '../config'

// eslint-disable-next-line import/prefer-default-export
export function getBscScanLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
): string {
  switch (type) {
    case 'transaction': {
      return `${BASE_BSC_SCAN_URLS[56]}/tx/${data}`
    }
    case 'token': {
      return `${BASE_BSC_SCAN_URLS[56]}/token/${data}`
    }
    case 'block': {
      return `${BASE_BSC_SCAN_URLS[56]}/block/${data}`
    }
    case 'countdown': {
      return `${BASE_BSC_SCAN_URLS[56]}/block/countdown/${data}`
    }
    default: {
      return `${BASE_BSC_SCAN_URLS[56]}/address/${data}`
    }
  }
}