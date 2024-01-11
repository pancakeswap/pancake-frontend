export function isAbortError(e: any) {
  return e instanceof Error && e.message.startsWith('The request took too long to respond.')
}
