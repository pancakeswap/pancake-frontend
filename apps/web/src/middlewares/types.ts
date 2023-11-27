import { NextMiddleware, NextRequest } from 'next/server'

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware

export interface ModifiedNextReq extends NextRequest {
  userIp?: string | null
}

export type EnumValues<T> = T extends { [key: string]: infer U } ? U : never
