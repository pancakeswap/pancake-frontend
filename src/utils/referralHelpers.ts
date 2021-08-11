import { ethers } from 'ethers'
import { REFERRAL_COOKIE, REFERRER } from '../config'

/**
 * Is the string a valid address
 * @param address
 * @returns boolean
 */
export const isValidAddress = (address: string): boolean => {
  return ethers.utils.isAddress(address)
}

/**
 * Get the normal address value
 * @param address
 * @returns string
 */
export const convertFromIcap = (address: string): string => {
  return isValidAddress(address) ? ethers.utils.getAddress(address) : null
}

/**
 * Convert normal address to icap address
 * @param address
 * @returns string
 */
export const convertToIcap = (address: string): string => {
  return isValidAddress(address) ? ethers.utils.getIcapAddress(address) : null
}

/**
 * get referral address
 */
export const getReferrer = () => {
  let ref
  const cookieRow = document.cookie.split('; ').find((row) => row.startsWith(`${REFERRAL_COOKIE}=`))
  if (cookieRow) {
    ref = cookieRow.split('=')[1]
  }
  return convertFromIcap(ref) || REFERRER
}
