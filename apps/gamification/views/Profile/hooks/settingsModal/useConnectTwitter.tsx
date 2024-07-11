import { signIn } from 'next-auth/react'

export const useConnectTwitter = () => {
  const connect = async () => {
    signIn('twitter')
  }

  return {
    connect,
  }
}
