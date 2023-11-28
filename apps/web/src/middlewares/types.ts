import { NextMiddleware, NextRequest } from 'next/server'

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware

export interface ExtendedNextReq extends NextRequest {
  userIp?: string | null
}
