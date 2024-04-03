export function isVercelToolbarEnabled() {
  return shouldInjectVercelToolbar() || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
}

export function shouldInjectVercelToolbar() {
  return process.env.NEXT_PUBLIC_VERCEL_ENV === 'local'
}
