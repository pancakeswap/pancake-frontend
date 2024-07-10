import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

const Divider = styled.div`
  margin: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

interface RemoveStageProps {
  continueToNextStage: () => void
}

const RemoveStage: React.FC<React.PropsWithChildren<RemoveStageProps>> = ({ continueToNextStage }) => {
  const { t } = useTranslation()
  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Remove from Market')}
        </Text>
        <Text mt="24px" color="textSubtle">
          {t('Removing this NFT from the marketplace will return it to your wallet.')}
        </Text>
        <Text mt="16px" color="textSubtle">
          {t('Continue?')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default RemoveStage
