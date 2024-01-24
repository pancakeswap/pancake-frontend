import { Box, ChevronDownIcon, Flex, ModalV2, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { TokenImage } from 'components/TokenImage'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { DesktopPredictionTokenSelector } from 'views/Predictions/components/TokenSelector/Desktop'
import { MobilePredictionTokenSelector } from 'views/Predictions/components/TokenSelector/Mobile'
import { Price } from 'views/Predictions/components/TokenSelector/Price'
import { SvgToken } from 'views/Predictions/components/TokenSelector/SvgToken'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import { usePredictionConfigs } from 'views/Predictions/hooks/usePredictionConfigs'

const SelectedToken = styled(Box)`
  position: absolute;
  top: 2px;
  left: 3px;
  width: 38px;
  height: 38px;

  ${({ theme }) => theme.mediaQueries.lg} {
    top: 3px;
    left: 5px;
    width: 60px;
    height: 60px;
  }
`

const Selector = styled(Flex)<{ isOpen: boolean; isSingleToken?: boolean }>`
  flex-direction: column;
  position: relative;
  left: -22px;
  cursor: ${({ isSingleToken }) => (isSingleToken ? 'initial' : 'pointer')};
  background: ${({ theme }) => theme.colors.input};
  border: ${({ theme }) => `solid 1px ${theme.colors.cardBorder}`};
  border-radius: 8px 8px 24px 8px;
  min-width: auto;
  margin-top: 5px;
  user-select: none;
  height: fit-content;

  ${({ theme }) => theme.mediaQueries.lg} {
    left: -12px;
    margin-top: 15px;
    border-radius: 16px;
    min-width: 272px;
    height: ${({ isOpen }) => (isOpen ? 'auto' : '42px')};
  }
`

export const TokenSelector = () => {
  const router = useRouter()
  const { isDesktop } = useMatchBreakpoints()
  const [isOpen, setIsOpen] = useState(false)
  const config = useConfig()
  const predictionConfigs = usePredictionConfigs()

  useEffect(() => {
    const handleClickOutside = () => {
      onDismiss()
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const tokenListData = useMemo(() => {
    return predictionConfigs
      ? Object.values(predictionConfigs).filter((i) => i.token.symbol !== config?.token?.symbol)
      : []
  }, [config, predictionConfigs])

  const isTokenListMoreThanOne: boolean = useMemo(() => tokenListData?.length > 0, [tokenListData])

  const onClickSwitchToken = useCallback(
    (tokenSymbol: string) => {
      if (tokenSymbol && isTokenListMoreThanOne) {
        router.query.token = tokenSymbol
        router.replace(router, undefined, { scroll: false })

        setIsOpen(false)
      }
    },
    [router, isTokenListMoreThanOne],
  )

  const onClickOpenSelector = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isTokenListMoreThanOne) {
      setIsOpen(!isOpen)
      event.stopPropagation()
    }
  }

  const onDismiss = () => {
    setIsOpen(false)
  }

  return (
    <Flex>
      <Box position="relative" zIndex={11}>
        <SvgToken width={isDesktop ? 70 : 44} height={isDesktop ? 70 : 44} color={config?.tokenBackgroundColor} />
        {config?.token && (
          <SelectedToken>
            <TokenImage width={isDesktop ? 60 : 38} height={isDesktop ? 60 : 38} token={config?.token} />
          </SelectedToken>
        )}
      </Box>
      <Selector isOpen={isOpen && isDesktop} isSingleToken={!isTokenListMoreThanOne}>
        <Flex
          width="100%"
          mt={['0', '0', '0', '0', '5px']}
          flexDirection={['column', 'column', 'column', 'column', 'row']}
          padding={['0 8px 0 24px', '0 8px 0 24px', '0 8px 0 24px', '0 8px 0 24px', '2px 12px 2px 16px']}
          justifyContent="space-between"
          onClick={onClickOpenSelector}
        >
          <Text
            bold
            color="secondary"
            textTransform="uppercase"
            fontSize={['16px', '16px', '16px', '16px', '24px']}
            style={{ alignSelf: isDesktop ? 'center' : 'flex-start' }}
            lineHeight="110%"
          >
            {`${config?.token?.symbol}USD`}
          </Text>
          <Flex>
            <Price
              fontSize={['12px', '12px', '12px', '12px', '16px']}
              displayedDecimals={config?.displayedDecimals}
              chainlinkOracleAddress={config?.chainlinkOracleAddress}
              galetoOracleAddress={config?.galetoOracleAddress}
            />
            {isTokenListMoreThanOne && (
              <ChevronDownIcon width={isDesktop ? 24 : 16} height={isDesktop ? 24 : 16} ml="4px" color="primary" />
            )}
          </Flex>
        </Flex>
        {isDesktop ? (
          <DesktopPredictionTokenSelector
            isOpen={isOpen}
            tokenListData={tokenListData}
            onClickSwitchToken={onClickSwitchToken}
          />
        ) : (
          <ModalV2 isOpen={isOpen} closeOnOverlayClick onDismiss={onDismiss}>
            <MobilePredictionTokenSelector
              tokenListData={tokenListData}
              onDismiss={onDismiss}
              onClickSwitchToken={onClickSwitchToken}
            />
          </ModalV2>
        )}
      </Selector>
    </Flex>
  )
}
