import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { ifosConfig } from 'config/constants'
import styled, { keyframes, css } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Text } from '@pancakeswap/uikit'
import { VestingData } from 'views/Ifos/hooks/vesting/fetchUserWalletIfoData'
import { PoolIds } from 'config/constants/types'
import Info from './Info'

const expandAnimation = keyframes`
  from {
    opacity: 0;
    max-height: 0px;
  }
  to {
    opacity: 1;
    max-height: 484px;
  }
`

const collapseAnimation = keyframes`
  from {
    opacity: 1;
    max-height: 484px;
  }
  to {
    opacity: 0;
    max-height: 0px;
  }
`

const StyledExpand = styled(Box)<{ expanded: boolean }>`
  position: relative;
  z-index: 0;
  opacity: 1;
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  margin: 0 -24px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.dropdown};
`

interface ExpandProps {
  data: VestingData
  expanded: boolean
  fetchUserVestingData: () => void
}

const Expand: React.FC<React.PropsWithChildren<ExpandProps>> = ({ data, expanded, fetchUserVestingData }) => {
  const { t } = useTranslation()
  const { id, token } = data.ifo
  const ifoIsActive = useMemo(() => ifosConfig.find((ifo) => ifo.isActive && ifo.id === id), [id])
  const router = useRouter()

  const handleViewIfo = () => {
    router.push(`/ifo/history#${token.symbol.toLowerCase()}`)
  }

  return (
    <StyledExpand expanded={expanded}>
      <Info poolId={PoolIds.poolUnlimited} data={data} fetchUserVestingData={fetchUserVestingData} />
      <Info poolId={PoolIds.poolBasic} data={data} fetchUserVestingData={fetchUserVestingData} />
      {!ifoIsActive && (
        <Text bold color="primary" textAlign="center" style={{ cursor: 'pointer' }} onClick={handleViewIfo}>
          {t('View IFO')}
        </Text>
      )}
    </StyledExpand>
  )
}

export default Expand
