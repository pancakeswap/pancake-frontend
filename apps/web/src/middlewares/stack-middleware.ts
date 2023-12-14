// middlewares/stackMiddlewares
import { NextResponse } from 'next/server'
import { MiddlewareFactory, NextMiddleware } from './types'

export function stackMiddlewares(functions: MiddlewareFactory[] = [], index = 0): NextMiddleware {
  const current = functions[index]
  if (current) {
    const next = stackMiddlewares(functions, index + 1)
    return current(next)
  }
  return () => NextResponse.next()
}
