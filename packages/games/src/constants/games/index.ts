import shuffle from 'lodash/shuffle'
import { GameType } from '../../types'
// Project
import { pancakeProtectors } from './pancakeProtectors'
import { binaryX } from './binaryX'

export const TOP_GAMES_LIST: GameType[] = [pancakeProtectors]

export const DEFAULT_GAMES_LIST: GameType[] = [binaryX]

export const GAMES_LIST = [...TOP_GAMES_LIST, ...shuffle(DEFAULT_GAMES_LIST)]
