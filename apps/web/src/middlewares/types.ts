import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export type MiddlewareResult = NextResponse | null | undefined | void
export type NextMiddleware = (
  request: NextRequest,
  event: NextFetchEvent,
) => MiddlewareResult | Promise<MiddlewareResult>

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware

export interface ExtendedNextReq extends NextRequest {
  p_user_ip?: string | null
  p_client_id?: string | undefined
}
