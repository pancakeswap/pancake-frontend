import fs from 'fs'
import api from '../api'
import settings from './settings'
import { SettingsObject } from './types'
import { getFormattedData } from './parser'

const CMSSync = (config: SettingsObject[]) => {
  config.forEach((item: SettingsObject) => {
    console.info(` ✅ - ${item.name}`)
    api(item.link).then((res) => {
      const [, secondKey] = Object.keys(res)
      const formattedData = getFormattedData(item.type, res[secondKey])
      fs.writeFileSync(`src/config/constants/${item.name}.json`, JSON.stringify(formattedData, undefined, 2))
    })
  })
}

CMSSync(settings)

export default CMSSync
