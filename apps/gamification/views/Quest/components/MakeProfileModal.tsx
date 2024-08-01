import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, Image, InjectedModalProps, Link, Modal, ModalBody, OpenNewIcon, Text } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import { Profile } from 'hooks/useProfile/type'

interface MakeProfileModalProps extends InjectedModalProps {
  type: string
  profile: Profile | undefined
  hasActiveProfile: boolean
}

export const MakeProfileModal: React.FC<MakeProfileModalProps> = ({ type, profile, hasActiveProfile, onDismiss }) => {
  const { t } = useTranslation()

  return (
    <Modal title={t('Make a profile')} onDismiss={onDismiss}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={['100%', '100%', '100%', '368px']}
      >
        <ModalBody>
          <Image
            alt="make-profile"
            width={288}
            height={100}
            style={{
              margin: 'auto',
              minWidth: 288,
            }}
            src={`${ASSET_CDN}/gamification/images/make-profile.png`}
          />
          <Text textAlign="center" m="24px 0">
            {t(
              'Make a profile to participate in the %type%. Every profile starts by making a “starter” collectible (NFT). It’ll only cost a tiny bit for gas fees.',
              { type },
            )}
          </Text>
          {profile === undefined && !hasActiveProfile && (
            <Link href="/create-profile" width="100% !important">
              <Button width="100%" endIcon={<OpenNewIcon color="invertedContrast" />}>
                {t('Make a profile')}
              </Button>
            </Link>
          )}
          {profile && !hasActiveProfile && (
            <Link href="/profile" width="100% !important">
              <Button width="100%" endIcon={<OpenNewIcon color="invertedContrast" />}>
                {t('Reactivate profile')}
              </Button>
            </Link>
          )}
        </ModalBody>
      </Flex>
    </Modal>
  )
}
