import { useTranslation } from '@pancakeswap/localization'
import { Box, CheckmarkCircleFillIcon, ErrorIcon, Flex, Text } from '@pancakeswap/uikit'
import { formatNumber, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import Image from 'next/image'
import { useMemo } from 'react'
import { styled } from 'styled-components'
import { useVeCakeUserCreditWithTime } from 'views/Pools/hooks/useVeCakeUserCreditWithTime'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'

const SnapShotTimeContainer = styled(Flex)<{ $isValid: boolean }>`
  width: 100%;
  flex-direction: column;
  padding: 16px;
  border-radius: 24px;
  border: ${({ $isValid, theme }) => ($isValid ? '2px dashed #e7e3eb' : `1px solid ${theme.colors.warning}`)};
  background-color: ${({ theme, $isValid }) => ($isValid ? theme.colors.tertiary : 'rgba(255, 178, 55, 0.10)')};
`

interface PreviewOfVeCakeSnapShotTimeProps {
  endTime: number
  isValidLockAmount: boolean
}

export const PreviewOfVeCakeSnapShotTime: React.FC<React.PropsWithChildren<PreviewOfVeCakeSnapShotTimeProps>> = ({
  endTime,
  isValidLockAmount,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const valid = isValidLockAmount

  const { userCreditWithTime } = useVeCakeUserCreditWithTime(endTime)

  const previewVeCakeAtSnapshot = useMemo(
    () => formatNumber(getBalanceNumber(new BigNumber(userCreditWithTime)), 2, 2),
    [userCreditWithTime],
  )

  return (
    <SnapShotTimeContainer $isValid={valid}>
      <Flex flexDirection={['column', 'column', 'column', 'row']} justifyContent={['space-between']}>
        <Box>
          <Text bold as="span" color="textSubtle" fontSize={12}>
            {t('Preview of')}
          </Text>
          <Text bold as="span" color="secondary" ml="4px" fontSize={12}>
            {t('*veCAKE at snapshot time:')}
          </Text>
        </Box>
        <Text>{timeFormat(locale, endTime)}</Text>
      </Flex>
      <Flex justifyContent={['space-between']}>
        <Flex>
          <Image
            width={39}
            height={39}
            alt="trading-reward-vecake"
            src="/images/trading-reward/trading-reward-vecake-icon.png"
          />
          <Text style={{ alignSelf: 'center' }} bold ml="8px" fontSize="20px">
            {`${t('veCAKE')}⌛`}
          </Text>
        </Flex>
        <Flex>
          <Text bold mr="4px" fontSize="20px" color={valid ? 'text' : 'warning'} style={{ alignSelf: 'center' }}>
            {previewVeCakeAtSnapshot}
          </Text>
          {valid ? <CheckmarkCircleFillIcon color="success" width={24} /> : <ErrorIcon color="warning" width={24} />}
        </Flex>
      </Flex>
      {valid ? (
        <Text fontSize={14} mt="8px" bold textAlign="right" color="success">
          {t('Min. veCAKE will be reached at snapshot time')}
        </Text>
      ) : (
        <Text fontSize={14} mt="8px" bold textAlign="right" color="warning">
          {t('Min. veCAKE won’t be reached at snapshot time')}
        </Text>
      )}
    </SnapShotTimeContainer>
  )
}
