import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, Farm as FarmUI } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import ConnectWalletButton from 'components/ConnectWalletButton'
import styled from 'styled-components'
import BoostedAction from '../../YieldBooster/components/BoostedAction'
import FarmInfo from './FarmInfo'

const { NoPosition } = FarmUI.FarmV3Card

const Action = styled.div`
  padding-top: 16px;
`

const ActionContainer = styled.div`
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

interface FarmCardActionsProps {
  farm: any
  account?: string
  addLiquidityUrl?: string
  lpLabel?: string
  displayApr?: string
}

const CardActions: React.FC<React.PropsWithChildren<FarmCardActionsProps>> = ({ farm, account, addLiquidityUrl }) => {
  const { t } = useTranslation()
  const isReady = farm.multiplier !== undefined
  const { stakedBalance, tokenBalance, proxy } = farm.userData
  const hasNoPosition = false // TODO: FARM_V3

  return (
    <Action>
      {account && !hasNoPosition ? (
        <FarmInfo farm={farm} isReady={isReady} liquidityUrlPathParts={addLiquidityUrl} />
      ) : (
        <NoPosition
          account={account}
          hasNoPosition={hasNoPosition}
          liquidityUrlPathParts={addLiquidityUrl}
          connectWalletButton={<ConnectWalletButton mt="8px" width="100%" />}
          boostedAction={
            farm.boosted && (
              <BoostedAction
                title={(status) => (
                  <Flex>
                    <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px" pr="4px">
                      {t('Yield Booster')}
                    </Text>
                    <Text bold textTransform="uppercase" color="secondary" fontSize="12px">
                      {status}
                    </Text>
                  </Flex>
                )}
                desc={(actionBtn) => <ActionContainer>{actionBtn}</ActionContainer>}
                farmPid={farm.pid}
                lpTokenStakedAmount={farm.lpTokenStakedAmount}
                userBalanceInFarm={
                  (stakedBalance.plus(tokenBalance).gt(0)
                    ? stakedBalance.plus(tokenBalance)
                    : proxy?.stakedBalance.plus(proxy?.tokenBalance)) ?? BIG_ZERO
                }
              />
            )
          }
        />
      )}
    </Action>
  )
}

export default CardActions
