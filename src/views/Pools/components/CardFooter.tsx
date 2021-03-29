import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import useI18n from 'hooks/useI18n'
import { ChevronDown, ChevronUp } from 'react-feather'
import Balance from 'components/Balance'
import { CommunityTag, CoreTag, BinanceTag } from 'components/Tags'
import { useBlock } from 'state/hooks'
import { PoolCategory } from 'config/constants/types'
import { Text, LinkExternal, TimerIcon, Flex, MetamaskIcon } from '@pancakeswap-libs/uikit'
import { registerToken } from 'utils/wallet'
import { BASE_URL } from 'config'

const tags = {
  [PoolCategory.BINANCE]: BinanceTag,
  [PoolCategory.CORE]: CoreTag,
  [PoolCategory.COMMUNITY]: CommunityTag,
}

interface Props {
  projectLink: string
  stakingTokenName: string
  stakingDecimals: number
  totalStaked: BigNumber
  earningTokenName: string
  earningTokenAddress: string
  earningTokenDecimals: number
  startBlock: number
  endBlock: number
  isFinished: boolean
  poolCategory: PoolCategory
}

const StyledFooter = styled.div<{ isFinished: boolean }>`
  border-top: 1px solid ${({ theme }) => theme.colors.borderColor};
  color: ${({ theme }) => theme.colors.primary};
  padding: 24px;
`

const StyledDetailsButton = styled.button`
  align-items: center;
  background-color: transparent;
  border: 0;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  font-weight: 600;
  height: 32px;
  justify-content: center;
  outline: 0;
  padding: 0;
  &:hover {
    opacity: 0.9;
  }
  & > svg {
    margin-left: 4px;
  }
`

const Row = styled(Flex)`
  align-items: center;
`

const FlexFull = styled.div`
  flex: 1;
`
const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
  font-size: 14px;

  svg {
    width: 16px;
  }
`

const TokenLink = styled.a`
  font-size: 14px;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  margin-left: auto;
`

const CardFooter: React.FC<Props> = ({
  projectLink,
  stakingTokenName,
  stakingDecimals,
  earningTokenAddress,
  totalStaked,
  earningTokenName,
  earningTokenDecimals,
  isFinished,
  startBlock,
  endBlock,
  poolCategory,
}) => {
  const { account } = useWeb3React()
  const { currentBlock } = useBlock()
  const [isOpen, setIsOpen] = useState(false)
  const TranslateString = useI18n()
  const Icon = isOpen ? ChevronUp : ChevronDown

  const handleClick = () => setIsOpen(!isOpen)
  const Tag = styled(tags[poolCategory])`
    height: 24px;
    padding: 0 6px;
    svg {
      width: 14px;
    }
  `

  const blocksUntilStart = Math.max(startBlock - currentBlock, 0)
  const blocksRemaining = Math.max(endBlock - currentBlock, 0)

  const imageSrc = `${BASE_URL}/images/tokens/${earningTokenName.toLowerCase()}.png`

  return (
    <StyledFooter isFinished={isFinished}>
      <Row>
        <FlexFull>
          <Tag />
        </FlexFull>
        <StyledDetailsButton onClick={handleClick}>
          {isOpen ? TranslateString(1066, 'Hide') : TranslateString(658, 'Details')} <Icon />
        </StyledDetailsButton>
      </Row>
      {isOpen && (
        <>
          <Row mb="4px" mt="20px">
            <FlexFull>
              <Text fontSize="14px">{TranslateString(999, 'Total staked')}</Text>
            </FlexFull>
            <Balance fontSize="14px" value={getBalanceNumber(totalStaked, stakingDecimals)} bold={false} />
            &nbsp;
            <Text fontSize="14px">{stakingTokenName}</Text>
          </Row>
          {blocksUntilStart > 0 && (
            <Row>
              <FlexFull>
                <Text fontSize="14px">{TranslateString(1212, 'Start')}:</Text>
              </FlexFull>
              <Balance fontSize="14px" isDisabled={isFinished} value={blocksUntilStart} decimals={0} />
            </Row>
          )}
          {blocksUntilStart === 0 && blocksRemaining > 0 && (
            <Row>
              <FlexFull>
                <Text fontSize="14px">{TranslateString(410, 'End')}:</Text>
              </FlexFull>
              <Balance fontSize="14px" value={blocksRemaining} decimals={0} color="primary" bold={false} />
              <TimerIcon color="primary" width="16px" />
            </Row>
          )}
          <StyledLinkExternal href={projectLink} ml="auto">
            {TranslateString(999, 'Project site')}
          </StyledLinkExternal>
          <StyledLinkExternal href="#" ml="auto">
            {TranslateString(999, 'Info site')}
          </StyledLinkExternal>
          {!!account && (
            <Flex mb="4px">
              <TokenLink
                onClick={() => registerToken(earningTokenAddress, earningTokenName, earningTokenDecimals, imageSrc)}
              >
                Add {earningTokenName} to Metamask
              </TokenLink>
              <MetamaskIcon height={14} width={14} ml="4px" />
            </Flex>
          )}
        </>
      )}
    </StyledFooter>
  )
}

export default React.memo(CardFooter)
