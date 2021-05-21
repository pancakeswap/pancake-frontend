import React from 'react'
import styled from 'styled-components'
import { Text, Skeleton } from '@pancakeswap/uikit'
// import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'


export interface UserValueProps {
  userValue: BigNumber
}

const UserValueWrapper = styled.div`
  min-width: 110px;
  font-weight: 600;
  text-align: right;
  margin-right: 14px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
`

const UserValue: React.FunctionComponent<UserValueProps> = ({ userValue }) => {
  const displayUserValue = userValue ? (
    `$${Number(userValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  ) : (
    <Skeleton width={60} />
  )
//  const { t } = useTranslation()

  return (
    <Container>
      <UserValueWrapper>
        <Text>{displayUserValue}</Text>
      </UserValueWrapper>
{/*      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip} */}
    </Container>
  )
}

export default UserValue
