import shuffle from 'lodash/shuffle'
import { GameType } from '../../types'
// Project
import { binaryX } from './binaryX'
import { nemesisDownfall } from './nemesisDownfall'
import { pancakeProtectors } from './pancakeProtectors'
import { shadowRealm } from './shadowRealm'

export const TOP_GAMES_LIST: GameType[] = [pancakeProtectors]

export const DEFAULT_GAMES_LIST: GameType[] = [shadowRealm, nemesisDownfall, binaryX]

export const GAMES_LIST = [...TOP_GAMES_LIST, ...shuffle(DEFAULT_GAMES_LIST)]
