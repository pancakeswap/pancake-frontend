import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, HelpIcon, useTooltip } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useWeb3React } from '@pancakeswap/wagmi'

interface ButtonMenuProps {
  cakePrice: BigNumber
  stakingTokenBalance: BigNumber
  setPrincipalFromUSDValue: (amount: string) => void
}

const ButtonMenu: React.FC<React.PropsWithChildren<ButtonMenuProps>> = ({
  cakePrice,
  stakingTokenBalance,
  setPrincipalFromUSDValue,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'Your chance of winning is proportional to the CAKE you deposit relative to the total CAKE deposit for Pottery. Currently, there is a cap to the total CAKE deposit size during the beta release.',
    ),
    {
      placement: 'top-end',
      tooltipOffset: [20, 10],
    },
  )

  return (
    <Flex justifyContent="space-between" mt="8px">
      <Button scale="xs" p="4px 16px" width="68px" variant="tertiary" onClick={() => setPrincipalFromUSDValue('100')}>
        $100
      </Button>
      <Button scale="xs" p="4px 16px" width="68px" variant="tertiary" onClick={() => setPrincipalFromUSDValue('1000')}>
        $1000
      </Button>
      <Button
        scale="xs"
        p="4px 16px"
        width="128px"
        variant="tertiary"
        style={{ textTransform: 'uppercase' }}
        disabled={!stakingTokenBalance.isFinite() || stakingTokenBalance.lte(0) || !account}
        onClick={() => setPrincipalFromUSDValue(getBalanceNumber(stakingTokenBalance.times(cakePrice)).toString())}
      >
        {t('My Balance')}
      </Button>
      <span ref={targetRef}>
        <HelpIcon width="16px" height="16px" color="textSubtle" />
      </span>
      {tooltipVisible && tooltip}
    </Flex>
  )
}

export default ButtonMenu
