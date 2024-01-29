import { useTranslation } from '@pancakeswap/localization'
import { Box, CheckmarkCircleFillIcon, ErrorIcon, Flex, Text } from '@pancakeswap/uikit'
import Image from 'next/image'
import { styled } from 'styled-components'

const SnapShotTimeContainer = styled(Flex)<{ $isValid: boolean }>`
  width: 100%;
  flex-direction: column;
  padding: 16px;
  border-radius: 24px;
  border: ${({ $isValid, theme }) => ($isValid ? '2px dashed #e7e3eb' : `1px solid ${theme.colors.warning}`)};
  background-color: ${({ theme, $isValid }) => ($isValid ? theme.colors.tertiary : 'rgba(255, 178, 55, 0.10)')};
`

export const PreviewOfVeCakeSnapShotTime = () => {
  const { t } = useTranslation()
  const valid = false

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
        <Text>16 Feb 2024, 21:45</Text>
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
            500.30
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
