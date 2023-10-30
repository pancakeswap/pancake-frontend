import { useMemo } from 'react'
import { GAMES_LIST, GameType } from '@pancakeswap/games'

export const useGamesConfig = (): GameType[] => useMemo(() => GAMES_LIST, [])
