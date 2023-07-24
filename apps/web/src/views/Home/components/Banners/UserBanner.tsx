import { useTranslation } from '@pancakeswap/localization'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { memo } from 'react'
import styled, { useTheme } from 'styled-components'
import UserInfoBanner from '../UserBanner'
import * as S from './Styled'

const StyledInner = styled(S.Inner)`
  padding: 0;
  height: 100%;
  max-height: auto;
  > div {
    width: 100%;
    min-height: 188px;
    border-radius: 32px;
  }
`

const UserBanner = () => {
  return (
    <S.Wrapper
      style={{
        background: 'linear-gradient(180deg, rgba(67, 69, 117, 0.80) 0%, rgba(102, 87, 141, 0.80) 100%)',
      }}
    >
      <StyledInner>
        <UserInfoBanner />
      </StyledInner>
    </S.Wrapper>
  )
}

export default memo(UserBanner)
