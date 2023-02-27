import { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, CardFooter, ExpandableLabel, HelpIcon, Pool } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import PoolStatsInfo from '../../PoolStatsInfo'
import PoolTypeTag from '../../PoolTypeTag'

interface FooterProps {
  pool: Pool.DeserializedPool<Token>
  account: string
  totalCakeInVault?: BigNumber
  defaultExpanded?: boolean
  isLocked?: boolean
}

const ExpandableButtonWrapper = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  button {
    padding: 0;
  }
`
const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`

const Footer: React.FC<React.PropsWithChildren<FooterProps>> = ({
  pool,
  account,
  defaultExpanded,
  children,
  isLocked = false,
}) => {
  const { vaultKey } = pool
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || false)

  return (
    <CardFooter>
      <ExpandableButtonWrapper>
        <Flex alignItems="center">
          <PoolTypeTag vaultKey={vaultKey} isLocked={isLocked} account={account}>
            {(targetRef) => (
              <Flex ref={targetRef}>
                <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
              </Flex>
            )}
          </PoolTypeTag>
        </Flex>
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? t('Hide') : t('Details')}
        </ExpandableLabel>
      </ExpandableButtonWrapper>
      {isExpanded && (
        <ExpandedWrapper flexDirection="column">
          {children || <PoolStatsInfo pool={pool} account={account} />}
        </ExpandedWrapper>
      )}
    </CardFooter>
  )
}

export default Footer
