import React from 'react'
import { CardHeader, Heading, Text, Flex, Image } from '@rug-zombie-libs/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; background?: string }>`
  background: ${({ isFinished, background, theme }) =>
    isFinished ? "#101820" : theme.colors.primary};
`

const StyledCardHeader: React.FC<{
  earningTokenSymbol: string
  stakingTokenSymbol: string
  isAutoVault?: boolean
  isFinished?: boolean
}> = ({ earningTokenSymbol, stakingTokenSymbol, isFinished = false, isAutoVault = false }) => {
  const { t } = useTranslation()
  const poolImageSrc = `${stakingTokenSymbol}.png`.toLowerCase()
  const isCakePool = earningTokenSymbol === 'ZMBE' && stakingTokenSymbol === 'ZMBE'

  const getSubHeading = () => {
    if (isAutoVault) {
      return `${t('Automatic restaking')}`
    }
    if (isCakePool) {
      return `${t('Earn ZMBE, stake ZMBE')}`
    }
    return `${t('Stake')} ${stakingTokenSymbol}`
  }

  return (
    <Wrapper isFinished={isFinished} color="#101820" >
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column">
          <Heading color={isFinished ? 'textDisabled' : 'body'} size="lg">
            {`Earn ${earningTokenSymbol}`}
          </Heading>
          <Text color={isFinished ? 'textDisabled' : 'textSubtle'}>{getSubHeading()}</Text>
        </Flex>
        <Image src={`/images/pools/${poolImageSrc}`} alt={earningTokenSymbol} width={64} height={64} />
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
