import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { PredictionConfig, PredictionSupportedSymbol } from '@pancakeswap/prediction'
import { Box, Flex, OptionProps, Select, Text } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useMemo } from 'react'
import { setLeaderboardFilter } from 'state/predictions'
import { styled } from 'styled-components'
import { NetworkSwitcher } from 'views/Predictions/Leaderboard/components/Filters/NetworkSelect'
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

const Filters: React.FC<React.PropsWithChildren<FiltersProps>> = ({
  pickedChainId,
  pickedTokenSymbol,
  predictionConfigs,
  setPickedTokenSymbol,
  setPickedChainId,
}) => {
  const { t } = useTranslation()
  const dispatch = useLocalDispatch()

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
    dispatch(setLeaderboardFilter({ orderBy: option.value }))
  }

  const tokenOptions = useMemo(() => {
    return predictionConfigs
      ? Object.values(predictionConfigs)?.map((i) => ({
          label: i?.token?.symbol ?? '',
          value: i?.token?.symbol ?? '',
        }))
      : []
  }, [predictionConfigs])

  const handleTokenChange = (option: OptionProps) => {
    setPickedTokenSymbol(option?.value)
  }

  const handleSwitchNetwork = (network: ChainId) => {
    setPickedChainId(network)
  }

  return (
    <Container position="relative" py="32px" zIndex={3}>
      <Flex width={['100%']} flexDirection={['column', 'column', 'column', 'column', 'row']}>
        <Flex width={['100%']} flexDirection={['column', 'column', 'column', 'column', 'row']}>
          <NetworkSwitcher pickedChainId={pickedChainId} setPickedChainId={handleSwitchNetwork} />
          <Box width={['100%', '100%', '100%', 'auto']} m={['18px 0', '18px 0', '18px 0', '18px 0', '0 24px']}>
            <Text textTransform="uppercase" fontSize="12px" color="textSubtle" fontWeight="bold" mb="4px">
              {t('Token')}
            </Text>
            <FilterWrapper>
              {predictionConfigs && pickedTokenSymbol && tokenOptions.length > 0 && (
                <Select options={tokenOptions} onOptionChange={handleTokenChange} />
              )}
            </FilterWrapper>
          </Box>
          <Box width={['100%', '100%', '100%', 'auto']}>
            <Text textTransform="uppercase" fontSize="12px" color="textSubtle" fontWeight="bold" mb="4px">
              {t('Rank By')}
            </Text>
            <FilterWrapper>
              <Select options={orderByOptions} onOptionChange={handleOrderBy} />
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
