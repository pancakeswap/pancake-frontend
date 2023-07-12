import { NextRouter } from 'next/router'

export const getHashFromRouter = (router: NextRouter) => {
  return router.asPath.match(/#([a-z0-9]+)/gi)
}
