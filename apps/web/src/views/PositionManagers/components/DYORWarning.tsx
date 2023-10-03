import { useTranslation } from '@pancakeswap/localization'
import { Message, MessageText, Text, Flex, Box, Link } from '@pancakeswap/uikit'
import { MANAGER, baseManagers, BaseManager } from '@pancakeswap/position-managers'
import { useMemo } from 'react'

interface DYORWarningProps {
  manager: {
    id: MANAGER
    name: string
  }
}

export const DYORWarning: React.FC<DYORWarningProps> = ({ manager }) => {
  const { t } = useTranslation()
  const managerInfo: BaseManager = useMemo(() => baseManagers[manager.id], [manager])

  if (!managerInfo?.doYourOwnResearchTitle && !managerInfo?.introLink) {
    return null
  }

  return (
    <Message variant="warning" mt="8px">
      <MessageText>
        <Flex flexDirection="column">
          <Box>
            <Text fontSize={14} as="span" color="warning">
              {t('You are providing liquidity via a 3rd party liquidity manager')}
            </Text>
            <Link
              bold
              external
              m="0 4px"
              fontSize={14}
              color="warning"
              display="inline-block !important"
              href={managerInfo.introLink}
              style={{ textDecoration: 'underline' }}
            >
              {managerInfo.doYourOwnResearchTitle}
            </Link>
            <Text fontSize={14} as="span" color="warning">
              {t('which is responsible for managing the underlying assets.')}
            </Text>
          </Box>
          <Text fontSize={14} as="span" bold mt="8px" color="warning">
            {t('Please always DYOR before depositing your assets.')}
          </Text>
        </Flex>
      </MessageText>
    </Message>
  )
}
