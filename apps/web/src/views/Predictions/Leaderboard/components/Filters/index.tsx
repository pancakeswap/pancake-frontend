import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { PredictionConfig, PredictionSupportedSymbol, targetChains } from '@pancakeswap/prediction'
import { Box, Flex, OptionProps, Select, Text } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import { getImageUrlFromToken } from 'components/TokenImage'
import { ASSET_CDN } from 'config/constants/endpoints'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useMemo, useState } from 'react'
import { setLeaderboardFilter } from 'state/predictions'
import { styled } from 'styled-components'
import AddressSearch from '../AddressSearch'

const SearchWrapper = styled(Box)`
  position: relative;
  margin: 24px 0 8px 0;
  order: 1;
  width: 100%;
  z-index: 2;
  align-self: flex-end;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0 auto 0 0;
    order: 2;
    width: 320px;
  }
`
const FilterWrapper = styled(Box)`
  position: relative;
  order: 2;
  width: 100%;
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.lg} {
    order: 1;
    width: auto;
  }
`

interface FiltersProps {
  pickedChainId: ChainId
  pickedTokenSymbol: string
  predictionConfigs: Record<string, PredictionConfig> | undefined
  setPickedTokenSymbol: (value: PredictionSupportedSymbol) => void
  setPickedChainId: (chainId: ChainId) => void
}

const DEFAULT_ORDER = 'totalBets'

const Filters: React.FC<React.PropsWithChildren<FiltersProps>> = ({
  pickedChainId,
  pickedTokenSymbol,
  predictionConfigs,
  setPickedTokenSymbol,
  setPickedChainId,
}) => {
  const { t } = useTranslation()
  const dispatch = useLocalDispatch()
  const [pickedOrder, setPickedOrder] = useState(DEFAULT_ORDER)

  const orderByOptions = useMemo(() => {
    const isOldPrediction =
      (pickedChainId === ChainId.BSC && pickedTokenSymbol === PredictionSupportedSymbol.BNB) ||
      (pickedChainId === ChainId.BSC && pickedTokenSymbol === PredictionSupportedSymbol.CAKE)
    const netAmount = isOldPrediction ? `net${pickedTokenSymbol}` : 'netAmount'
    const totalAmount = isOldPrediction ? `total${pickedTokenSymbol}` : 'totalAmount'

    return [
      { label: t('Rounds Played'), value: 'totalBets' },
      { label: t('Net Winnings'), value: netAmount },
      { label: t('Total %symbol%', { symbol: pickedTokenSymbol }), value: totalAmount },
      { label: t('Win Rate'), value: 'winRate' },
    ]
  }, [pickedChainId, pickedTokenSymbol, t])

  const handleOrderBy = (option: OptionProps) => {
    setPickedOrder(option.value)
    dispatch(setLeaderboardFilter({ orderBy: option.value }))
  }

  const networkOptions = useMemo(() => {
    return (
      targetChains?.map((i) => ({
        label: i?.name ?? '',
        value: i?.id?.toString?.() ?? '',
        imageUrl: `${ASSET_CDN}/web/chains/${i.id}.png`,
      })) ?? []
    )
  }, [])

  const tokenOptions = useMemo(() => {
    return predictionConfigs
      ? Object.values(predictionConfigs)?.map((i) => ({
          label: i?.token?.symbol ?? '',
          value: i?.token?.symbol ?? '',
          imageUrl: getImageUrlFromToken(i?.token),
        }))
      : []
  }, [predictionConfigs])

  // When switch network / token make sure order set to default
  const resetOrder = () => {
    setPickedOrder(DEFAULT_ORDER)
    dispatch(setLeaderboardFilter({ orderBy: DEFAULT_ORDER }))
  }

  const handleSwitchNetwork = (option: OptionProps) => {
    resetOrder()
    setPickedChainId(option?.value)
  }

  const handleTokenChange = (option: OptionProps) => {
    resetOrder()
    setPickedTokenSymbol(option?.value)
  }

  const orderSelectedIndex = useMemo(() => {
    const index = orderByOptions.findIndex((option) => option.value === pickedOrder)
    return index >= 0 ? index + 1 : 0
  }, [pickedOrder, orderByOptions])

  const networkSelectedIndex = useMemo(() => {
    const index = networkOptions.findIndex((option) => Number(option.value) === pickedChainId)
    return index >= 0 ? index + 1 : 0
  }, [networkOptions, pickedChainId])

  const tokenSelectedIndex = useMemo(() => {
    const index = tokenOptions.findIndex((option) => option.value === pickedTokenSymbol)
    return index >= 0 ? index + 1 : 0
  }, [pickedTokenSymbol, tokenOptions])

  return (
    <Container position="relative" py="32px" zIndex={3}>
      <Flex width={['100%']} flexDirection={['column', 'column', 'column', 'column', 'row']}>
        <Flex zIndex={3} width={['100%']} flexDirection={['column', 'column', 'column', 'column', 'row']}>
          <Box zIndex={3} width={['100%', '100%', '100%', '100%', '240px']}>
            <Text textTransform="uppercase" fontSize="12px" color="textSubtle" fontWeight="bold" mb="4px">
              {t('Network')}
            </Text>
            {networkOptions.length > 0 && (
              <FilterWrapper>
                <Select
                  options={networkOptions}
                  defaultOptionIndex={networkSelectedIndex}
                  onOptionChange={handleSwitchNetwork}
                />
              </FilterWrapper>
            )}
          </Box>
          <Box
            zIndex={2}
            width={['100%', '100%', '100%', '100%', '180px']}
            m={['18px 0', '18px 0', '18px 0', '18px 0', '0 24px']}
          >
            <Text textTransform="uppercase" fontSize="12px" color="textSubtle" fontWeight="bold" mb="4px">
              {t('Token')}
            </Text>
            {predictionConfigs && pickedTokenSymbol && tokenOptions.length > 0 && (
              <FilterWrapper>
                <Select
                  options={tokenOptions}
                  defaultOptionIndex={tokenSelectedIndex}
                  onOptionChange={handleTokenChange}
                />
              </FilterWrapper>
            )}
          </Box>
          <Box width={['100%', '100%', '100%', '100%', '160px']}>
            <Text textTransform="uppercase" fontSize="12px" color="textSubtle" fontWeight="bold" mb="4px">
              {t('Rank By')}
            </Text>
            <FilterWrapper>
              <Select options={orderByOptions} defaultOptionIndex={orderSelectedIndex} onOptionChange={handleOrderBy} />
            </FilterWrapper>
          </Box>
        </Flex>
        <SearchWrapper>
          <AddressSearch
            token={predictionConfigs?.[pickedTokenSymbol]?.token}
            api={predictionConfigs?.[pickedTokenSymbol]?.api ?? ''}
          />
        </SearchWrapper>
      </Flex>
    </Container>
  )
}

export default Filters
