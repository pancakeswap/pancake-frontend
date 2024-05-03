import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Input, InputGroup, MoreIcon, OpenNewIcon, Text, useTooltip } from '@pancakeswap/uikit'
import { useState } from 'react'
import { SocialTaskType, useSocial } from 'views/DashboardQuestEdit/hooks/useSocial'

export const SocialTask = () => {
  const { t } = useTranslation()
  const [urlLink, setUrlLink] = useState('https://google.com')

  const social = SocialTaskType.X_LINK_POST

  const { socialIcon, socialNaming } = useSocial({ social })

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Open in new tab'), {
    placement: 'top',
  })

  const onclickOpenNewIcon = () => {
    window.open(urlLink, '_blank', 'noopener noreferrer')
  }

  return (
    <Flex>
      <Flex mr="8px" alignSelf="center">
        {socialIcon}
      </Flex>
      <Text style={{ alignSelf: 'center' }} bold>
        {socialNaming}
      </Text>
      <Flex ml="auto" alignSelf="center">
        <InputGroup
          endIcon={
            <Box ref={targetRef} onClick={onclickOpenNewIcon}>
              <OpenNewIcon style={{ cursor: 'pointer' }} color="primary" width="20px" />
              {tooltipVisible && tooltip}
            </Box>
          }
        >
          <Input style={{ borderRadius: '24px' }} value={urlLink} onChange={(e) => setUrlLink(e.target.value)} />
        </InputGroup>
        <MoreIcon style={{ cursor: 'pointer' }} color="primary" width="20px" height="20px" ml="8px" />
      </Flex>
    </Flex>
  )
}
