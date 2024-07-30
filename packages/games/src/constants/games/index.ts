import shuffle from 'lodash/shuffle'
import { GameType } from '../../types'
// Project
import { binaryX } from './binaryX'
import { nemesisDownfall } from './nemesisDownfall'
import { pancakeProtectors } from './pancakeProtectors'
import { shadowRealm } from './shadowRealm'
import { karatGalaxy } from './karatGalaxy'

export const TOP_GAMES_LIST: GameType[] = [karatGalaxy]

export const DEFAULT_GAMES_LIST: GameType[] = [pancakeProtectors, shadowRealm, nemesisDownfall, binaryX]

export const GAMES_LIST = [...TOP_GAMES_LIST, ...shuffle(DEFAULT_GAMES_LIST)]
