import React from 'react'
import styled from 'styled-components'
import { Text, Link } from '@pancakeswap-libs/uikit'
import Tooltip from 'views/Farms/components/Tooltip/Tooltip'

const StyledTooltip = styled(Tooltip)`
  bottom: -9px;
  left: 50%;
  right: 0;
  transform: translate(-50%, 100%);

  &:after {
    border-top: none;
    border-bottom: 10px solid ${({ theme }) => theme.tooltip.background};
    top: 0%;
    position: absolute;
    transform: translate(50%, -9px);
    right: 50%;
  }
`

const ToolTipInner = ({ blockNumber }) => {
  return (
    <>
      <Text color="body" mb="10px" fontWeight="600">
        Block {blockNumber}
      </Text>
      <Link external href={`https://bscscan.com/block/${blockNumber}`}>
        View on BscScan
      </Link>
    </>
  )
}

const TimerTooltip = ({ blockNumber, children }) => {
  return <StyledTooltip content={<ToolTipInner blockNumber={blockNumber} />}>{children}</StyledTooltip>
}

export default TimerTooltip
