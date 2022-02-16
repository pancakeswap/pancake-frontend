import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { Text, Button } from '@pancakeswap/uikit'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: auto;
  padding: 24px 40px;

  border-bottom: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-left: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-right: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-radius: ${({ theme }) => `0 0 ${theme.radii.card} ${theme.radii.card}`};
  background: ${({ theme }) =>
    theme.isDark
      ? 'linear-gradient(360deg, rgba(49, 61, 92, 0.9) 0%, rgba(61, 42, 84, 0.9) 100%)'
      : 'linear-gradient(180deg, rgba(202, 194, 236, 0.9) 0%,  rgba(204, 220, 239, 0.9) 51.04%, rgba(206, 236, 243, 0.9) 100%)'};

  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 1120px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row;
  }
`

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    margin-bottom: 0;
  }
`

const TextTitle = styled(Text)`
  font-size: 20px;
  text-align: center;
  ${({ theme }) => theme.mediaQueries.xl} {
    font-size: 40px;
    text-align: left;
  }
`

const TextSubTitle = styled(Text)`
  font-size: 14px;
  text-align: center;
  ${({ theme }) => theme.mediaQueries.xl} {
    font-size: 16px;
    text-align: left;
  }
`

const MigrationSticky: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Container>
      <TextGroup>
        <TextTitle bold>{t('MasterChef v2 Migration')}</TextTitle>
        <TextSubTitle>{t('You need to migrate in order to continue receving staking rewards.')}</TextSubTitle>
      </TextGroup>
      <NextLinkFromReactRouter to="/migration">
        <Button width="266px">{t('Proceed')}</Button>
      </NextLinkFromReactRouter>
    </Container>
  )
}

export default MigrationSticky
