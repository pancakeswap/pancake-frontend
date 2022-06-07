import { Flex } from '@pancakeswap/uikit'
import Image from 'next/image'
import useTheme from 'hooks/useTheme'
import PageSection from 'components/PageSection'
import { StaticImageData } from 'next/dist/client/image'
import { DARKBG } from './pageSectionStyles'
import BattleCta from './components/BattleCta'
import { CompetitionProps } from './types'
import { BottomBunnyWrapper } from './styles'

const Footer: React.FC<CompetitionProps & { shouldHideCta: boolean; image: StaticImageData }> = ({
  image,
  shouldHideCta,
  userTradingInformation,
  currentPhase,
  account,
  isCompetitionLive,
  profile,
  userCanClaimPrizes,
  finishedAndPrizesClaimed,
  finishedAndNothingToClaim,
  isLoading,
  hasCompetitionEnded,
  onRegisterSuccess,
  onClaimSuccess,
}) => {
  const { theme } = useTheme()

  return (
    <>
      <PageSection
        index={6}
        dividerPosition="top"
        dividerFill={{ light: '#191326' }}
        clipFill={{ light: theme.colors.background }}
        background={DARKBG}
      >
        <Flex alignItems="center">
          <BottomBunnyWrapper>
            <Image src={image} width={254} height={227} />
          </BottomBunnyWrapper>
          {shouldHideCta ? null : (
            <Flex height="fit-content">
              <BattleCta
                userTradingInformation={userTradingInformation}
                currentPhase={currentPhase}
                account={account}
                isCompetitionLive={isCompetitionLive}
                hasCompetitionEnded={hasCompetitionEnded}
                userCanClaimPrizes={userCanClaimPrizes}
                finishedAndPrizesClaimed={finishedAndPrizesClaimed}
                finishedAndNothingToClaim={finishedAndNothingToClaim}
                profile={profile}
                isLoading={isLoading}
                onRegisterSuccess={onRegisterSuccess}
                onClaimSuccess={onClaimSuccess}
              />
            </Flex>
          )}
        </Flex>
      </PageSection>
    </>
  )
}

export default Footer
