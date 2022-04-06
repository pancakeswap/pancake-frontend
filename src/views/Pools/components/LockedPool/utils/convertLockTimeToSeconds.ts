export default function convertLockTimeToSeconds(lockTime: string): number {
  return parseInt(lockTime) * 1000
}
