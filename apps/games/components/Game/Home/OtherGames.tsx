import { GameType } from '@pancakeswap/games'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Text } from '@pancakeswap/uikit'
import { Game } from 'components/Game/Home/Game'
import { Games } from 'components/Game/Home/Games'
import { useEffect, useMemo, useState } from 'react'
import { styled } from 'styled-components'

const StyledContainer = styled(Box)`
  width: 100%;
  padding: 68px 16px 40px 16px;
  background: ${({ theme }) => theme.colors.gradientVioletAlt};
  overflow: hidden;

  ${({ theme }) => theme.mediaQueries.md} {
    overflow: auto;
    padding: 68px 16px 107px 16px;
  }
`

interface OtherGamesProps {
  otherGames: GameType[]
}

export const OtherGames: React.FC<React.PropsWithChildren<OtherGamesProps>> = ({ otherGames }) => {
  const { t } = useTranslation()
  const [pickedGameId, setPickedGameId] = useState('')

  useEffect(() => {
    if (otherGames?.length) {
      setPickedGameId(otherGames?.[0]?.id)
    }
  }, [otherGames])

  const pickedGame: GameType | undefined = useMemo(
    () => otherGames?.find((i) => i.id === pickedGameId),
    [pickedGameId, otherGames],
  )

  return (
    <StyledContainer>
      <Text bold mb="32px" lineHeight="110%" textAlign="center" fontSize={['40px']}>
        {t('Explore Other Games')}
      </Text>
      {otherGames.length >= 2 && (
        <Games otherGames={otherGames} pickedGameId={pickedGameId} setPickedGameId={setPickedGameId} />
      )}
      {pickedGame && <Game game={pickedGame} />}
    </StyledContainer>
  )
}
