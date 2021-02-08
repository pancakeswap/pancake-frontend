import fs from 'fs'
import get from '../lib/http-get'
import settings from './settings'
import { SettingsObject } from './types'
import { getFormattedData } from './parser'

const CMSSync = (config: SettingsObject[]) => {
  config.forEach((item: SettingsObject) => {
    get(item.url).then((res: any) => {
      const formattedData = getFormattedData(item.type, res.data)
      fs.writeFile(`src/config/constants/${item.name}.json`, JSON.stringify(formattedData, undefined, 2), (err) => {
        if (err) throw err
        console.info(` ✅ - ${item.name} has been saved!`)
      })
    })
  })
}

CMSSync(settings)

export default CMSSync
