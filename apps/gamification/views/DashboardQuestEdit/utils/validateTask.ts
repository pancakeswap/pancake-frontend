import BigNumber from 'bignumber.js'

export const validateNumber = (amount: string) => {
  return !amount || new BigNumber(amount ?? 0).lte(0)
}

export const validateLpAddress = (lpAddress: string) => {
  const regex = /^(0x[a-fA-F0-9]{40})$/
  return !regex.test(lpAddress)
}

export const validateUrl = (url: string) => {
  const pattern =
    /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g

  return !pattern.test(url)
}
