import { useMemo } from 'react'
import { Flex, Box, Button, useModal, Text, Tag, CalculateIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import WinRateModal from 'views/Pottery/components/WinRateModal'
import { usePotteryData } from 'state/pottery/hook'

const WinRate: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { publicData, userData } = usePotteryData()

  const [openWinRateModal] = useModal(
    <WinRateModal stakingTokenBalance={userData.stakingTokenBalance} totalSupply={publicData.totalSupply} />,
  )

  const percentage = useMemo(() => {
    return userData.stakingTokenBalance.div(publicData.totalSupply).times(100).toNumber()
  }, [userData, publicData])

  const isSuccess = useMemo(() => percentage >= 50, [percentage])

  return (
    <>
      {userData.stakingTokenBalance.gt(0) && (
        <Box>
          <Flex alignItems="center" justifyContent="flex-end" onClick={openWinRateModal}>
            <Tag variant={isSuccess ? 'success' : 'failure'}>{`${percentage.toFixed(2)}%`}</Tag>
            <Button variant="text" width="20px" height="20px" padding="0px" marginLeft="4px">
              <CalculateIcon color="textSubtle" width="20px" />
            </Button>
          </Flex>
          <Text fontSize="12px" color="textSubtle" mt="4px" textAlign="right">
            {t('Chance of winning next round')}
          </Text>
        </Box>
      )}
    </>
  )
}

export default WinRate
