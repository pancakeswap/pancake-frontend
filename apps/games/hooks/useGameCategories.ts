import qs from 'qs'
import { useQuery } from '@tanstack/react-query'
import { fetchAPI, ResponseCategoriesType } from '@pancakeswap/blog'

interface UseGameCategoriesProps {
  languageOption: string
}

export interface GameCategoriesType {
  id: number
  name: string
  total: number
}

export const useGameCategories = ({ languageOption }: UseGameCategoriesProps): GameCategoriesType[] => {
  const { data } = useQuery({
    queryKey: ['game-categories'],

    queryFn: async () => {
      try {
        const urlParamsObject = {
          populate: '*',
          locale: languageOption,
        }
        const queryString = qs.stringify(urlParamsObject)
        const response = await fetchAPI(`/games-categories?${queryString}`)
        const result: ResponseCategoriesType[] = response.data
        const gameCategories: GameCategoriesType[] = result.map((category) => ({
          id: category.id,
          name: category.attributes.name,
          total: category?.attributes?.articles?.data?.length ?? 0,
        }))
        return gameCategories
      } catch (error) {
        console.error('Get all game categories error: ', error)
        return []
      }
    },

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  return data || []
}
