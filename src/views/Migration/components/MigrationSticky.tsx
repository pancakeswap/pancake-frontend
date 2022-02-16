import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { Text, Button } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ProgressStepsType } from './ProgressSteps'

const Container = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: auto;
  padding: 24px 40px;

  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 1120px;
  }

  border-top: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-left: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-right: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card}`} 0 0;
  background: ${({ theme }) =>
    theme.isDark
      ? 'linear-gradient(360deg, rgba(61, 42, 84, 0.9) 0%, rgba(49, 61, 92, 0.9) 100%)'
      : 'linear-gradient(180deg, rgba(206, 236, 243, 0.9) 0%,  rgba(204, 220, 239, 0.9) 51.04%, rgba(202, 194, 236, 0.9) 100%)'};
`

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
`

interface MigrationStickyProps {
  step: ProgressStepsType
  handleClick: () => void
}

const MigrationSticky: React.FC<MigrationStickyProps> = ({ step, handleClick }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const isStep1: boolean = step === ProgressStepsType.STEP1
  const title: string = isStep1 ? t('Unstaking LP Tokens and CAKE') : t('Stake in the new contract.')
  const subTitle: string = isStep1
    ? t('All the earned CAKE will be harvested to your wallet upon unstake.')
    : t('Each farm/pool has to be individually enable before staking.')
  const buttonText: string = isStep1 ? t('Go to Stake') : t('Skip')

  if (!account) {
    return (
      <Container>
        <TextGroup>
          <Text fontSize="40px" bold>
            {t('MasterChef v2 Migration')}
          </Text>
          <Text>{t('Please connect wallet to check your pools & farms status.')}</Text>
        </TextGroup>
        <ConnectWalletButton width="266px" />
      </Container>
    )
  }

  return (
    <Container>
      <TextGroup>
        <Text fontSize="40px" bold>
          {title}
        </Text>
        <Text>{subTitle}</Text>
      </TextGroup>
      <Button width="266px" onClick={handleClick}>
        {buttonText}
      </Button>
    </Container>
  )
}

export default MigrationSticky
