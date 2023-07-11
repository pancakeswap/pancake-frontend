import styled from 'styled-components'
import { SpaceProps } from 'styled-system'
import { memo, useMemo } from 'react'
import { Text, Row, VerifiedIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { MANAGER, Strategy, isManagerVerified } from '@pancakeswap/position-managers'

import { CardSection } from './CardSection'
import { getStrategyName } from '../utils'

interface Props extends SpaceProps {
  id: MANAGER
  name: string
  strategy: Strategy
}

const ManagerName = styled(Text).attrs({
  color: 'text',
  bold: true,
  fontSize: '1em',
})``

export const ManagerInfo = memo(function ManagerInfo({ id, name, strategy, ...props }: Props) {
  const { t } = useTranslation()
  const verified = useMemo(() => isManagerVerified(id), [id])
  const strategyName = useMemo(() => getStrategyName(t, strategy), [t, strategy])

  return (
    <CardSection title={t('Managed by')} {...props}>
      <Row>
        <ManagerName>{name}</ManagerName>
        {verified && <VerifiedIcon color="secondary" ml="0.25em" width="1em" />}
      </Row>
      <Row>
        <Text color="textSubtle" fontSize="12px">
          {t('With %strategy% strategy', {
            strategy: strategyName,
          })}
        </Text>
      </Row>
    </CardSection>
  )
})
