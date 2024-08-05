import { API_PROFILE } from 'config/constants/endpoints'

export const getUsername = async (address: string): Promise<string> => {
  try {
    const response = await fetch(`${API_PROFILE}/api/users/${address.toLowerCase()}`)

    if (!response.ok) {
      return ''
    }

    const { username = '' } = await response.json()

    return username
  } catch (error) {
    return ''
  }
}
