import { farmsConfig } from 'config/constants'

const getFarmConfig = (pid: number) => farmsConfig.find((f) => f.pid === pid)

export default getFarmConfig
