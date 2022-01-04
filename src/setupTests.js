/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

for (const envPath of ['.env.test', '.env.test.local']) {
  // eslint-disable-next-line global-require
  require('dotenv').config({ path: path.resolve(process.cwd(), envPath) })
}
