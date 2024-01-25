import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, CardBody, RowBetween, Select, Text } from '@pancakeswap/uikit'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { AppHeader } from 'components/App'
import { SNBNB } from 'config/constants/liquidStaking'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTokenBalance from 'hooks/useTokenBalance'
import NextLink from 'next/link'
import { OptionProps } from 'pages/liquid-staking/index'
import { Address } from 'wagmi'
import StakeInfo from '../components/StakeInfo'

interface LiquidStakingPageStakeProps {
  selectedList: OptionProps
  optionsList: OptionProps[]
  handleSortOptionChange: (value: any) => void
}

export const LiquidStakingPageStake: React.FC<LiquidStakingPageStakeProps> = ({
  selectedList,
  optionsList,
  handleSortOptionChange,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()

  const { balance: stakedTokenBalance } = useTokenBalance(selectedList.token1.address as Address)
  const userCakeDisplayBalance = getFullDisplayBalance(stakedTokenBalance, selectedList.token1.decimals, 6)

  return (
    <>
      <AppHeader
        shouldCenter
        subtitle={t('Unlock liquidity while earning rewards')}
        title={t('Liquid Staking')}
        noConfig
      />
      <CardBody>
        <Text fontSize="12px" mb="8px" color="secondary" bold textTransform="uppercase">
          {t('Choose a pair to liquid stake')}
        </Text>
        {optionsList.length > 0 && <Select mb="24px" options={optionsList} onOptionChange={handleSortOptionChange} />}
        <StakeInfo selectedList={selectedList} />

        <RowBetween mb="16px">
          <Text color="textSubtle" bold>
            {t('Your Staked Amount')}
          </Text>

          <Text ml="4px">
            {userCakeDisplayBalance} {selectedList?.token1?.symbol}
          </Text>
        </RowBetween>

        <Box mb="16px">
          <NextLink href={`/liquid-staking/${selectedList?.contract}`}>
            <Button width="100%">{t('Proceed')}</Button>
          </NextLink>
        </Box>
        {chainId && selectedList?.contract !== SNBNB[chainId] ? (
          <NextLink href={`/liquid-staking/request-withdraw/${selectedList?.contract}`}>
            <Button variant="secondary" disabled={stakedTokenBalance.eq(0)} width="100%">
              {t('Request Withdraw')}
            </Button>
          </NextLink>
        ) : null}
      </CardBody>
    </>
  )
}
