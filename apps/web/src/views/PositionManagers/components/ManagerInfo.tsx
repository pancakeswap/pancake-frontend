import { useTranslation } from '@pancakeswap/localization'
import { MANAGER, Strategy, isManagerVerified } from '@pancakeswap/position-managers'
import { Row, Text, VerifiedIcon } from '@pancakeswap/uikit'
import { memo, useMemo } from 'react'
import { styled } from 'styled-components'
import { SpaceProps } from 'styled-system'

import { getStrategyName } from '../utils'
import { CardSection } from './CardSection'

interface Props extends SpaceProps {
  id: MANAGER
  name: string
  strategy: Strategy
  allowTokenName?: string
}

const ManagerName = styled(Text).attrs({
  color: 'text',
  bold: true,
  fontSize: '1em',
})``

export const ManagerInfo = memo(function ManagerInfo({ id, name, strategy, allowTokenName, ...props }: Props) {
  const { t } = useTranslation()
  const verified = useMemo(() => isManagerVerified(id), [id])
  const strategyName = useMemo(() => getStrategyName(t, strategy, allowTokenName), [t, strategy, allowTokenName])

  return (
    <CardSection title={t('Managed by')} {...props}>
      <Row>
        <ManagerName>{name}</ManagerName>
        {verified && <VerifiedIcon color="secondary" ml="0.25em" width="1em" />}
      </Row>
      <Row>
        <Text color="textSubtle" fontSize="12px">
          {t('With')}
        </Text>
        <Text color="textSubtle" fontSize="12px" m="0 4px" bold>
          {strategyName}
        </Text>
        <Text color="textSubtle" fontSize="12px">
          {t('strategy')}
        </Text>
      </Row>
    </CardSection>
  )
})
