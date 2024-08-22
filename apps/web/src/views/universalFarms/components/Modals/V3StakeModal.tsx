import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { AtomBox, AutoColumn, Button, Image, Modal, ModalV2, StyledTooltip, Text } from '@pancakeswap/uikit'
import { LightCard } from 'components/Card'
import { ASSET_CDN } from 'config/constants/endpoints'
import styled from 'styled-components'

const Arrow = styled.div`
  position: absolute;
  top: 0px;
  transform: translate3d(0px, 62px, 0px);
  right: 4px;
  &::before {
    content: '';
    transform: rotate(45deg);
    background: var(--colors-backgroundAlt);
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    z-index: -1;
  }
`

interface IStakeModalProps {
  staking: boolean
  onStake?: (e: React.MouseEvent) => void
  onUnStake?: (e: React.MouseEvent) => void
  onDismiss: () => void
  isOpen: boolean
  disabled?: boolean
}

export const V3StakeModal: React.FC<React.PropsWithChildren<IStakeModalProps>> = ({
  disabled,
  staking,
  onStake,
  onUnStake,
  isOpen,
  onDismiss,
  children,
}) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  return (
    <ModalV2 isOpen={isOpen} onDismiss={onDismiss} closeOnOverlayClick>
      <Modal
        title={staking ? t('Staking') : t('Unstaking')}
        width={['100%', '100%', '450px']}
        maxWidth={['100%', null, '450px']}
      >
        <AutoColumn gap="16px">
          <AtomBox
            position="relative"
            style={{
              minHeight: '96px',
            }}
          >
            <AtomBox
              style={{
                width: '100%',
                position: 'absolute',
                right: 0,
                bottom: '-23px',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                zIndex: 1,
              }}
            >
              <StyledTooltip
                data-theme={isDark ? 'light' : 'dark'}
                style={{
                  maxWidth: '160px',
                  position: 'relative',
                }}
              >
                {staking ? (
                  <>
                    {t('Inactive positions will')}
                    <b> {t('NOT')} </b>
                    {t('earn CAKE rewards from farm.')}
                  </>
                ) : (
                  t('You may add or remove liquidity on the position detail page without unstake')
                )}
                <Arrow />
              </StyledTooltip>
              <Image
                src={`${ASSET_CDN}/web/universalFarms/bulb-bunny.png`}
                width={135}
                height={120}
                alt="bulb bunny reminds unstaking"
              />
            </AtomBox>
          </AtomBox>
          <LightCard style={{ position: 'relative' }}>{children}</LightCard>
          <Button
            variant={staking ? 'subtle' : 'primary'}
            onClick={staking ? onStake : onUnStake}
            width="100%"
            disabled={disabled}
          >
            {staking ? t('Continue Staking') : t('Unstake')}
          </Button>
          {staking ? null : (
            <Text color="textSubtle">
              {t(
                'Unstake will also automatically harvest any earnings that you haven’t collected yet, and send them to your wallet.',
              )}
            </Text>
          )}
        </AutoColumn>
      </Modal>
    </ModalV2>
  )
}
