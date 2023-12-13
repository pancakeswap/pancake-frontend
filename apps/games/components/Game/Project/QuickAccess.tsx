import { styled } from 'styled-components'
import { useState } from 'react'
import { Flex, Box, Text, Link, TelegramIcon, DiscordIcon, ChevronUpIcon } from '@pancakeswap/uikit'
import { Trans, useTranslation } from '@pancakeswap/localization'
import { GameType } from '@pancakeswap/games'

const StyledQuickAccess = styled(Box)<{ isOpen?: boolean }>`
  position: ${({ isOpen }) => (isOpen ? 'static' : 'absolute')};
  padding: 0 24px;
  right: 20px;
  bottom: 24px;
  background: ${({ theme }) => theme.colors.input};
  border-radius: ${({ isOpen }) => (isOpen ? '24px' : '24px 24px 0px 0px')};
  z-index: 50;
  cursor: pointer;
`

export const StyledLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`

const LIST = [
  {
    title: <Trans>NFT marketplace</Trans>,
    url: 'https://pancakeswap.finance/nfts',
  },
  {
    title: <Trans>Buy Squad / Bunnies</Trans>,
    url: 'https://pancakeswap.finance/nfts/collections/0x0a8901b0E25DEb55A87524f0cC164E9644020EBA',
  },
  {
    title: <Trans>Swap Token</Trans>,
    url: 'https://pancakeswap.finance/swap',
  },
]

interface QuickAccessProps {
  isOpen?: boolean
  game: GameType
}

export const QuickAccess: React.FC<React.PropsWithChildren<QuickAccessProps>> = ({ isOpen, game }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(isOpen ?? false)
  const telegram = game?.socialMedia?.telegram ?? ''
  const discord = game?.socialMedia?.discord ?? ''

  const toggleExpand = (e: { stopPropagation: () => void; preventDefault: () => void }) => {
    if (!isOpen) {
      e.stopPropagation()
      e.preventDefault()
      setIsExpanded(!isExpanded)
    }
  }

  const handleClick = (e: any, url: string) => {
    e.stopPropagation()
    e.preventDefault()
    window.open(url, '_blank', 'noopener noreferrer')
  }

  const articles = game?.articles?.map(({ title, link }) => (
    <Text key={link} padding="9px 0" onMouseDown={(e) => handleClick(e, link)}>
      {title}
    </Text>
  ))

  return (
    <StyledQuickAccess isOpen={isOpen}>
      <Flex padding="9px 0" justifyContent="space-between" onMouseDown={toggleExpand}>
        <Text color="textSubtle" bold>
          {t('Quick Access')}
        </Text>
        <ChevronUpIcon color="textSubtle" ml="16px" />
      </Flex>
      {isExpanded && (
        <Box>
          {LIST.map((i) => (
            <Text key={i.url} padding="9px 0" onMouseDown={(e) => handleClick(e, i.url)}>
              {i.title}
            </Text>
          ))}
          {articles}
          <>
            {telegram || discord ? (
              <Flex padding="16px 0">
                {telegram && (
                  <StyledLink external href={telegram} onMouseDown={(e) => handleClick(e, telegram)}>
                    <TelegramIcon color="textSubtle" />
                  </StyledLink>
                )}
                {discord && (
                  <StyledLink
                    external
                    href={discord}
                    ml={telegram ? '16px' : '0'}
                    onMouseDown={(e) => handleClick(e, discord)}
                  >
                    <DiscordIcon color="textSubtle" />
                  </StyledLink>
                )}
              </Flex>
            ) : null}
          </>
        </Box>
      )}
    </StyledQuickAccess>
  )
}
