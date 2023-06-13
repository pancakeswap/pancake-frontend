import { memo, useCallback } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, ButtonMenu, NotificationDot, ButtonMenuItem } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { usePositionManagerStatus, PositionManagerStatus } from '../hooks'

const Wrapper = styled(Flex).attrs({
  justifyContent: 'center',
  alignItems: 'center',
})`
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 1em;
  }
`

interface Props {
  notifyFinished?: boolean
}

export const LiveSwitch = memo(function LiveSwitch({ notifyFinished }: Props) {
  const { t } = useTranslation()
  const { status, setStatus } = usePositionManagerStatus()

  const onItemClick = useCallback(
    (index: number) => setStatus(index === 0 ? PositionManagerStatus.LIVE : PositionManagerStatus.FINISHED),
    [setStatus],
  )

  return (
    <Wrapper>
      <ButtonMenu
        activeIndex={status === PositionManagerStatus.LIVE ? 0 : 1}
        scale="sm"
        variant="subtle"
        onItemClick={onItemClick}
      >
        <ButtonMenuItem>{t('Live')}</ButtonMenuItem>
        <NotificationDot show={notifyFinished}>
          <ButtonMenuItem>{t('Finished')}</ButtonMenuItem>
        </NotificationDot>
      </ButtonMenu>
    </Wrapper>
  )
})
