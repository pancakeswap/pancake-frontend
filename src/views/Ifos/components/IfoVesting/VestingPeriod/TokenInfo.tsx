import { useState } from 'react'
import styled from 'styled-components'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { BalanceWithLoading } from 'components/Balance'
import { Box, Flex, Text, ChevronDownIcon } from '@pancakeswap/uikit'
import { ListLogo } from 'components/Logo'
import Expand from './Expand'

const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 24px;
`

const TokenInfo: React.FC = () => {
  const [expanded, setExpanded] = useState(false)
  const shouldRenderExpand = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <Box mb="20px" style={{ cursor: 'pointer' }} onClick={toggleExpanded}>
      <Flex mb="8px">
        <ListLogo
          logoURI="https://pancakeswap.finance/images/tokens/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c.png"
          style={{ marginTop: '8px' }}
        />
        <Flex flexDirection="column" ml="8px">
          <Text bold lineHeight="120%">
            Hotcross: Multichain Infra & Web3 Playground
          </Text>
          <Flex>
            <BalanceWithLoading color="secondary" value={3} decimals={3} bold fontSize="12px" />
            <Text color="textSubtle" textTransform="uppercase" fontSize="12px" margin="0 2px">
              HOTCROSS
            </Text>
          </Flex>
        </Flex>
        <ArrowIcon toggled={expanded} color="primary" ml="auto" />
      </Flex>
      {shouldRenderExpand && <Expand expanded={expanded} />}
    </Box>
  )
}

export default TokenInfo
