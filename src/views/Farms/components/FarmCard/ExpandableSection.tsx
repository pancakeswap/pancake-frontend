import React from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'

export interface ExpandableSectionProps {
  bscScanAddress?: string
}

const Link = styled.a`
  text-decoration: none;
  color: ${(props) => props.theme.colors.secondary};
`

const ExpandableSectionButton: React.FC<ExpandableSectionProps> = ({ bscScanAddress }) => {
  const TranslateString = useI18n()

  return (
    <>
      <Link href={bscScanAddress} target="_blank">
        {TranslateString(356, 'View on BscScan')} &gt;
      </Link>
    </>
  )
}

export default ExpandableSectionButton
