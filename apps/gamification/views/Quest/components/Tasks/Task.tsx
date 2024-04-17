import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  Card,
  CheckmarkCircleFillIcon,
  ChevronDownIcon,
  ErrorFillIcon,
  Flex,
  FlexGap,
  Loading,
  RefreshIcon,
  Text,
  TwitterIcon,
} from '@pancakeswap/uikit'
import { styled } from 'styled-components'

const VerifyButton = styled(Button)<{ $verified?: boolean }>`
  background-color: ${({ theme, $verified }) => ($verified ? theme.colors.success : theme.colors.secondary)};
`

const ErrorButton = styled(Button)<{ $isError?: boolean }>`
  background-color: ${({ theme, $isError }) => ($isError ? theme.colors.failure : theme.colors.warning)};
`

export const Task = () => {
  const { t } = useTranslation()
  const isVerified = true

  return (
    <Card>
      <Flex flexDirection="column" padding="16px">
        <Flex>
          <Flex mr="auto">
            <TwitterIcon color="textSubtle" width={20} height={20} />
            <Text ml="16px" bold>
              123
            </Text>
          </Flex>
          <Flex alignSelf="center">
            <ChevronDownIcon color="primary" width={20} height={20} />
            <CheckmarkCircleFillIcon color="success" />
            <Loading margin="auto" width={16} height={16} color="secondary" />
            <ErrorFillIcon color="warning" />
            <ErrorFillIcon color="failure" />
          </Flex>
        </Flex>
        <Box>
          <Text bold m="8px 0 16px 0">
            Please connect your Social Name account to continue
          </Text>
          <FlexGap gap="8px">
            <Button width="100%" scale="sm">
              Proceed to connect
            </Button>
            <VerifyButton
              scale="sm"
              width="100%"
              $verified={isVerified}
              endIcon={isVerified ? <CheckmarkCircleFillIcon color="white" /> : <Loading width={16} height={16} />}
            >
              {isVerified ? t('Verified ') : t('Verify')}
            </VerifyButton>
            <ErrorButton
              width="100%"
              scale="sm"
              $isError
              endIcon={<RefreshIcon style={{ transform: 'scaleX(-1) rotate(0deg)' }} color="white" />}
            >
              {t('Retry')}
            </ErrorButton>
          </FlexGap>
        </Box>
      </Flex>
    </Card>
  )
}
