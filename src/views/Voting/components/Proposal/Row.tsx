import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'

export const AddressColumn = styled(Flex).attrs({ alignItems: 'center' })`
  width: 192px;
`

export const ChoiceColumn = styled(Flex).attrs({ alignItems: 'center' })`
  flex: 1;
  width: 0;
  padding-left: 32px;
  padding-right: 32px;
`

export const VotingPowerColumn = styled(Flex).attrs({ alignItems: 'center' })`
  justify-content: end;
  width: 80px;
`

const Row = styled(Flex)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 16px 24px;
`

export default Row
