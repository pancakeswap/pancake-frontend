export function getEnv() {
  if (process.env.API_HOST && !(process.env.API_HOST.includes('qa') || process.env.API_HOST.includes('dev'))) {
    return 'prod'
  }
  if (process.env.API_HOST && process.env.API_HOST.includes('qa')) {
    return 'qa'
  }
  if (process.env.API_HOST && process.env.API_HOST.includes('dev')) {
    return 'dev'
  }
  return 'local'
}
