import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  DeleteOutlineIcon,
  Flex,
  Input,
  InputGroup,
  OpenNewIcon,
  Text,
  useMatchBreakpoints,
  useTooltip,
} from '@pancakeswap/uikit'
import { useState } from 'react'
import { SocialTaskType, useSocial } from 'views/DashboardQuestEdit/hooks/useSocial'

export const SocialTask = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
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
    <Flex flexDirection={['column', 'column', 'row']}>
      <Flex>
        <Flex mr="8px" alignSelf="center">
          {socialIcon}
        </Flex>
        <Text style={{ alignSelf: 'center' }} bold>
          {socialNaming}
        </Text>
        {isMobile && (
          <DeleteOutlineIcon style={{ cursor: 'pointer' }} color="primary" width="20px" height="20px" ml="auto" />
        )}
      </Flex>
      <Flex width={['100%', '100%', 'fit-content']} m={['8px 0 0 0', '8px 0 0 0', '0 0 0 auto']} alignSelf="center">
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
        {!isMobile && (
          <DeleteOutlineIcon style={{ cursor: 'pointer' }} color="primary" width="20px" height="20px" ml="8px" />
        )}
      </Flex>
    </Flex>
  )
}
