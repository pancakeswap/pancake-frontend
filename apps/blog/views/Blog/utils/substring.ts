export const subString = (wording: string, limitLength: number) => {
  if (wording.length > limitLength) {
    return `${wording.substr(0, limitLength)}...`
  }
  return wording
}
