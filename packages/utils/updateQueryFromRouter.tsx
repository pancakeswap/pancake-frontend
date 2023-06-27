import { NextRouter } from 'next/router'
import isUndefinedOrNull from './isUndefinedOrNull'

const updateQueryFromRouter = (router: NextRouter, objectKey: string, objectValue: any) => {
  let newQuery
  if (typeof router.query?.[objectKey] === 'string' && !objectValue) {
    newQuery = Object.fromEntries(Object.entries(router.query).filter(([key]) => !key.includes(objectKey)))
  } else if (!isUndefinedOrNull(objectValue)) {
    newQuery = {
      ...router.query,
      [objectKey]: objectValue,
    }
  }
  if (newQuery) {
    router.replace(
      {
        query: newQuery,
      },
      undefined,
      {
        shallow: true,
      },
    )
  }
}

export default updateQueryFromRouter
