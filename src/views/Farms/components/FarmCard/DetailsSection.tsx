import React from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'

export interface ExpandableSectionProps {
  bscScanAddress?: string
  removed?: boolean
  totalValueFormated?: string
  lpSymbol?: string
}

const Link = styled.a`
  text-decoration: none;
  color: ${(props) => props.theme.colors.secondary};
`

const Label = styled.div`
  line-height: 1.5rem;
  color: ${(props) => props.theme.colors.secondary};
  > span {
    float: left;
  }
  .right {
    float: right;
    color: ${(props) => props.theme.colors.primary};
    font-weight: 900;
  }
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  bscScanAddress,
  removed,
  totalValueFormated,
  lpSymbol,
}) => {
  const TranslateString = useI18n()

  return (
    <>
      <Label>
        <span>{TranslateString(316, 'Stake')}</span>
        <span className="right">{lpSymbol}</span>
      </Label>
      {!removed && (
        <Label>
          <span>{TranslateString(23, 'Total Liquidity')}</span>
          <span className="right">{totalValueFormated}</span>
        </Label>
      )}
      <Link href={bscScanAddress} target="_blank">
        {TranslateString(356, 'View on BscScan')} &gt;
      </Link>
    </>
  )
}

export default DetailsSection
