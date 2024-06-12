import { signIn } from 'next-auth/react'

interface DiscordResponse {
  accent_color: null | string
  avatar: null | string
  avatar_decoration_data: null | string
  banner: null | string
  banner_color: null | string
  clan: null | string
  discriminator: string
  flags: number
  global_name: string
  id: string
  locale: string
  mfa_enabled: boolean
  premium_type: number
  public_flags: number
  username: string
}

export const useConnectDiscord = () => {
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     // Url will be like #token_type=Bearer&access_token=${access_token}&expires_in=${expires_in}&scope=identify
  //     const fragment = new URLSearchParams(window.location.hash.slice(1))
  //     const accessToken = fragment.get('access_token')

  //     // Update the URL in the address bar without reloading the page
  //     const newURL = `${window.location.origin}${window.location.pathname}`
  //     window.history.pushState({}, '', newURL)

  //     if (accessToken) {
  //       try {
  //         const response = await fetch('https://discord.com/api/users/@me', {
  //           headers: {
  //             authorization: `Bearer ${accessToken}`,
  //           },
  //         })
  //         const data: DiscordResponse = await response.json()
  //         // response.id is what we want
  //         console.log(data)
  //       } catch (error) {
  //         console.error('Error fetching discord user data:', error)
  //       }
  //     }
  //   }

  //   fetchUser()
  // }, [])

  const connect = () => {
    console.log('sss')
    signIn('discord')
    // const url =
    //   'https://discord.com/oauth2/authorize?client_id=1247444580874453065&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A3005%2Fprofile&scope=identify'
    // window.location.href = url
  }

  return {
    connect,
  }
}
