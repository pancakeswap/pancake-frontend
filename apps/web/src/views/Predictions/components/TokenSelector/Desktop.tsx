import { useImageColor } from '@pancakeswap/hooks'
import { PredictionConfig } from '@pancakeswap/prediction'
import { Box, ChevronDownIcon, Flex, Text } from '@pancakeswap/uikit'
import { formatBigIntToFixed } from '@pancakeswap/utils/formatBalance'
import { TokenImage, getImageUrlFromToken } from 'components/TokenImage'
import { useEffect, useMemo } from 'react'
import CountUp from 'react-countup'
import { styled } from 'styled-components'
import { Address } from 'viem'
import { SvgToken } from 'views/Predictions/components/TokenSelector/SvgToken'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import usePollOraclePrice from 'views/Predictions/hooks/usePollOraclePrice'

const SelectedToken = styled(Box)`
  position: absolute;
  top: 3px;
  left: 5px;
  width: 60px;
  height: 60px;
`

const Selector = styled(Flex)<{ isOpen: boolean; isSingleToken?: boolean }>`
  flex-direction: column;
  position: relative;
  left: -9px;
  width: 100%;
  cursor: ${({ isSingleToken }) => (isSingleToken ? 'initial' : 'pointer')};
  background: ${({ theme }) => theme.colors.input};
  border: ${({ theme }) => `solid 1px ${theme.colors.cardBorder}`};
  border-radius: 16px;
  min-width: 272px;
  margin-top: 15px;
  user-select: none;
  height: ${({ isOpen }) => (isOpen ? 'auto' : '42px')};
`

const DropDownListContainer = styled(Flex)`
  position: absolute;
  top: 40px;
  left: -1px;
  width: 100.6%;
  cursor: pointer;
  border: ${({ theme }) => `solid 1px ${theme.colors.cardBorder}`};
  border-radius: 0 0 16px 16px;
  background: ${({ theme }) => theme.colors.input};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  border-top-color: ${({ theme }) => theme.colors.inputSecondary};
  max-height: 500px;
  overflow-y: auto;

  &:hover {
    background: ${({ theme }) => theme.colors.inputSecondary};
  }
`

interface DesktopPredictionTokenSelectorProps {
  isOpen: boolean
  isTokenListMoreThanOne: boolean
  tokenListData: PredictionConfig[]
  setIsOpen: (open: boolean) => void
  onClickSwitchToken: (tokenSymbol: string) => void
}

const Price = ({ chainlinkOracleAddress }: { chainlinkOracleAddress: Address }) => {
  const { price } = usePollOraclePrice(chainlinkOracleAddress)

  const priceAsNumber = useMemo(() => parseFloat(formatBigIntToFixed(price, 4, 8)), [price])

  if (!Number.isFinite(priceAsNumber)) {
    return null
  }

  return (
    <CountUp start={0} preserveValue delay={0} end={priceAsNumber} prefix="$" decimals={4} duration={1}>
      {({ countUpRef }) => (
        <Text style={{ alignSelf: 'center' }} bold fontSize="16px">
          <span ref={countUpRef} />
        </Text>
      )}
    </CountUp>
  )
}

export const DesktopPredictionTokenSelector: React.FC<React.PropsWithChildren<DesktopPredictionTokenSelectorProps>> = ({
  isOpen,
  tokenListData,
  isTokenListMoreThanOne,
  setIsOpen,
  onClickSwitchToken,
}) => {
  const config = useConfig()
  const { color: ImageColor } = useImageColor({ url: getImageUrlFromToken(config?.token) }) // TODO: Check with jackson

  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <Flex>
      <Box position="relative" zIndex={11}>
        <SvgToken width={70} height={70} color={ImageColor} />
        <SelectedToken>
          <TokenImage width={60} height={60} token={config?.token} />
        </SelectedToken>
      </Box>
      <Selector isOpen={isOpen} isSingleToken={isTokenListMoreThanOne}>
        <Flex
          width="100%"
          padding="2px 12px 2px 16px"
          justifyContent="space-between"
          onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            setIsOpen(!isOpen)
            event.stopPropagation()
          }}
        >
          <Text bold color="secondary" fontSize={['24px']} textTransform="uppercase" style={{ alignSelf: 'center' }}>
            {`${config?.token?.symbol}USD`}
          </Text>
          {isTokenListMoreThanOne && (
            <Flex>
              {config?.chainlinkOracleAddress && <Price chainlinkOracleAddress={config?.chainlinkOracleAddress} />}
              <ChevronDownIcon width={24} height={24} ml="4px" color="primary" />
            </Flex>
          )}
        </Flex>
        {isOpen && (
          <DropDownListContainer>
            {tokenListData?.map((list) => (
              <Flex
                width="100%"
                padding="8px 39px 8px 16px"
                key={list.address}
                onClick={() => onClickSwitchToken(list?.token?.symbol)}
              >
                <TokenImage style={{ alignSelf: 'center' }} mr="8px" width={24} height={24} token={list?.token} />
                <Text
                  bold
                  color="textSubtle"
                  fontSize={['20px']}
                  textTransform="uppercase"
                  style={{ alignSelf: 'center' }}
                  mr="auto"
                >
                  {`${list?.token?.symbol}USD`}
                </Text>
                {list?.chainlinkOracleAddress && <Price chainlinkOracleAddress={list?.chainlinkOracleAddress} />}
              </Flex>
            ))}
          </DropDownListContainer>
        )}
      </Selector>
    </Flex>
  )
}
