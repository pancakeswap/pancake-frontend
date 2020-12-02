import { farmsConfig } from 'sushi/lib/constants'

const getFarmConfig = (pid: number) => farmsConfig.find((f) => f.pid === pid)

export default getFarmConfig
