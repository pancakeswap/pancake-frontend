/* eslint-disable @typescript-eslint/ban-types */
import { usePreviousValue } from '@pancakeswap/hooks'
import { Trans, useTranslation } from '@pancakeswap/localization'
import { AtomBox } from '@pancakeswap/ui/components/AtomBox'
import {
  Button,
  Heading,
  Image,
  LinkExternal,
  ModalV2,
  ModalV2Props,
  MoreHorizontalIcon,
  SvgProps,
  Tab,
  TabMenu,
} from '@pancakeswap/uikit'
import { Text } from '@pancakeswap/uikit/src/components/Text'
import clsx from 'clsx'
import { lazy, PropsWithChildren, Suspense, useState } from 'react'
import { isMobile } from 'react-device-detect'
import {
  desktopWalletSelectionClass,
  modalWrapperClass,
  moreIconClass,
  walletButtonVariants,
  walletSelectWrapperClass,
} from './WalletModal.css'

const Qrcode = lazy(() => import('./components/QRCode'))

type LinkOfTextAndLink = string | { text: string; url: string }

type DeviceLink = {
  desktop?: LinkOfTextAndLink
  mobile?: LinkOfTextAndLink
}

type LinkOfDevice = string | DeviceLink

export interface WalletConfigV2<T = unknown> {
  title: string
  icon: string | FC<React.PropsWithChildren<SvgProps>>
  connectorId: T
  deepLink?: string
  installed?: boolean
  guide?: LinkOfDevice
  downloadLink?: LinkOfDevice
  mobileOnly?: boolean
  qrCode?: () => Promise<string>
}

interface WalletModalV2Props<T = unknown> extends ModalV2Props {
  wallets: WalletConfigV2<T>[]
  login: (connectorId: T) => Promise<void>
}

const StepDot = ({ active, place, onClick }: { active: boolean; place: 'left' | 'right'; onClick: () => void }) => (
  <AtomBox padding="4px" onClick={onClick} cursor="pointer">
    <AtomBox
      bgc={active ? 'secondary' : 'inputSecondary'}
      width="56px"
      height="8px"
      borderLeftRadius={place === 'left' ? 'card' : '0'}
      borderRightRadius={place === 'right' ? 'card' : '0'}
    />
  </AtomBox>
)

const steps = [
  {
    title: <Trans>Your first step entering the defi world</Trans>,
    icon: 'https://cdn.pancakeswap.com/wallets/wallet_intro.png',
    description: (
      <Trans>
        A Web3 Wallet allows you to send and receive crypto assets like bitcoin, BNB, ETH, NFTs and much more.
      </Trans>
    ),
  },
  {
    title: <Trans>Login using wallet connection</Trans>,
    icon: 'https://cdn.pancakeswap.com/wallets/world_lock.png',
    description: (
      <Trans>
        Instead of setting up new accounts and passwords for every website, simply connect your wallet in one go.
      </Trans>
    ),
  },
]

const Tutorial = () => {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)

  const s = steps[step]

  return (
    <AtomBox
      display="flex"
      width="full"
      flexDirection="column"
      style={{ gap: '24px' }}
      mx="auto"
      my="48px"
      textAlign="center"
      alignItems="center"
    >
      {s && (
        <>
          <Heading as="h2" color="secondary">
            {s.title}
          </Heading>
          <Image m="auto" src={s.icon} width={198} height={178} />
          <Text maxWidth="368px" m="auto" small color="textSubtle">
            {s.description}
          </Text>
        </>
      )}
      <AtomBox display="flex">
        <StepDot place="left" active={step === 0} onClick={() => setStep(0)} />
        <StepDot place="right" active={step === 1} onClick={() => setStep(1)} />
      </AtomBox>
      <Button variant="subtle" external as={LinkExternal} color="backgroundAlt">
        {t('Learn How to Connect')}
      </Button>
    </AtomBox>
  )
}

const TabContainer = ({ children }: PropsWithChildren) => {
  const [index, setIndex] = useState(0)
  const { t } = useTranslation()

  return (
    <AtomBox
      position="relative"
      zIndex="modal"
      width={{
        xs: 'full',
        md: 'auto',
      }}
    >
      <AtomBox position="absolute" style={{ top: '-50px' }}>
        <TabMenu activeIndex={index} onItemClick={setIndex} gap="16px">
          <Tab>{t('Connect Wallet')}</Tab>
          <Tab>{t('What’s Web3 Wallet?')}</Tab>
        </TabMenu>
      </AtomBox>
      <AtomBox
        display="flex"
        position="relative"
        background="gradientCardHeader"
        borderRadius="card"
        borderBottomRadius={{
          xs: '0',
          md: 'card',
        }}
        zIndex="modal"
        width="full"
        className={modalWrapperClass}
      >
        {index === 0 && children}
        {index === 1 && <Tutorial />}
      </AtomBox>
    </AtomBox>
  )
}

const docLangCodeMapping: Record<string, string> = {
  it: 'italian',
  ja: 'japanese',
  fr: 'french',
  tr: 'turkish',
  vi: 'vietnamese',
  id: 'indonesian',
  'zh-cn': 'chinese',
  'pt-br': 'portuguese-brazilian',
}

function MobileModal<T>({ wallets, login, ...props }: WalletModalV2Props<T>) {
  const {
    t,
    currentLanguage: { code },
  } = useTranslation()

  const walletsToShow: WalletConfigV2<T>[] = wallets.filter((w) => w.installed || w.deepLink)

  return (
    <ModalV2 width="full" closeOnOverlayClick {...props}>
      <TabContainer>
        <AtomBox width="full">
          <Text color="textSubtle" small p="24px">
            {t('Starts connect with one of the wallets below. Manage and store your private keys and assets securely.')}
          </Text>
          <AtomBox flex={1} py="16px">
            <WalletSelect
              displayCount={6}
              wallets={walletsToShow}
              onClick={(wallet) => {
                if (wallet.installed) {
                  login(wallet.connectorId)
                }
                if (wallet.deepLink) {
                  window.open(wallet.deepLink)
                }
              }}
            />
          </AtomBox>
          <AtomBox p="24px" borderTop="1">
            <AtomBox>
              <Text textAlign="center" color="textSubtle" as="p" mb="24px">
                {t('Haven’t got a crypto wallet yet?')}
              </Text>
            </AtomBox>
            <Button
              as="a"
              href={
                docLangCodeMapping[code]
                  ? `https://docs.pancakeswap.finance/v/${docLangCodeMapping[code]}/get-started/connection-guide`
                  : `https://docs.pancakeswap.finance/get-started/connection-guide`
              }
              variant="subtle"
              width="100%"
              external
            >
              {t('Learn How to Connect')}
            </Button>
          </AtomBox>
        </AtomBox>
      </TabContainer>
    </ModalV2>
  )
}

function WalletSelect<T>({
  wallets,
  onClick,
  selected,
  displayCount = 5,
}: {
  wallets: WalletConfigV2<T>[]
  onClick: (wallet: WalletConfigV2<T>) => void
  selected?: WalletConfigV2<T>
  displayCount?: number
}) {
  const [showMore, setShowMore] = useState(false)
  const walletsToShow = showMore ? wallets : wallets.slice(0, displayCount)
  return (
    <AtomBox
      display="grid"
      overflowY="auto"
      overflowX="hidden"
      px={{ xs: '16px', sm: '48px' }}
      className={walletSelectWrapperClass}
    >
      {walletsToShow.map((wallet) => {
        const isImage = typeof wallet.icon === 'string'
        const Icon = wallet.icon

        return (
          <Button
            variant="text"
            height="auto"
            as={AtomBox}
            display="flex"
            alignItems="center"
            style={{ justifyContent: 'flex-start', letterSpacing: 'normal', padding: '0' }}
            flexDirection="column"
            onClick={() => onClick(wallet)}
          >
            <AtomBox
              bgc="dropdown"
              display="flex"
              justifyContent="center"
              alignItems="center"
              className={clsx(walletButtonVariants({ selected: wallet.title === selected?.title }), moreIconClass)}
              mb="4px"
            >
              {isImage ? (
                <Image src={Icon} width={50} height={50} />
              ) : (
                <Icon width={24} height={24} color="textSubtle" />
              )}
            </AtomBox>
            <Text fontSize="12px" textAlign="center">
              {wallet.title}
            </Text>
          </Button>
        )
      })}
      {!showMore && wallets.length > displayCount && (
        <AtomBox display="flex" justifyContent="center" alignItems="center" flexDirection="column">
          <Button height="auto" variant="text" as={AtomBox} flexDirection="column" onClick={() => setShowMore(true)}>
            <AtomBox
              className={moreIconClass}
              display="flex"
              justifyContent="center"
              alignItems="center"
              bgc="dropdown"
            >
              <MoreHorizontalIcon color="text" />
            </AtomBox>
            <Text fontSize="12px" textAlign="center" mt="4px">
              More
            </Text>
          </Button>
        </AtomBox>
      )}
    </AtomBox>
  )
}

export function WalletModalV2<T = unknown>(props: WalletModalV2Props<T>) {
  const { wallets, login, ...rest } = props

  const [selected, setSelected] = useState<WalletConfigV2<T> | null>(null)
  const [error, setError] = useState(false)
  const previousWallet = usePreviousValue(selected)
  const [qrCode, setQrCode] = useState<string | undefined>(undefined)

  const connectToWallet = (wallet: WalletConfigV2<T>) => {
    setError(false)
    if (wallet.installed) {
      login(wallet.connectorId)?.catch(() => {
        setError(true)
      })
    }
  }

  const { t } = useTranslation()

  if (isMobile) {
    return <MobileModal {...props} />
  }

  return (
    <ModalV2 closeOnOverlayClick {...rest}>
      <TabContainer>
        <AtomBox
          display="flex"
          flexDirection="column"
          bg="backgroundAlt"
          py="32px"
          zIndex="modal"
          borderRadius="card"
          className={desktopWalletSelectionClass}
        >
          <AtomBox px="48px">
            <Heading color="color" as="h4">
              {t('Connect Wallet')}
            </Heading>
            <Text color="textSubtle" small pt="24px" pb="32px">
              {t(
                'Starts connect with one of the wallets below. Manage and store your private keys and assets securely.',
              )}
            </Text>
          </AtomBox>
          <WalletSelect
            wallets={wallets}
            onClick={(w) => {
              setSelected(w)
              setQrCode(undefined)
              if (w.deepLink) {
                setQrCode(w.deepLink)
              } else if (w.qrCode) {
                w.qrCode().then((uri) => {
                  setQrCode(uri)
                })
              }
              if (previousWallet?.connectorId !== w.connectorId) {
                connectToWallet(w)
              }
            }}
          />
        </AtomBox>
        <AtomBox flex={1} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
          <AtomBox display="grid" style={{ gap: '24px' }} textAlign="center">
            {!selected && <Intro />}
            {selected && selected.installed && (
              <>
                <Image src={selected.icon} width={108} height={108} />
                <Heading as="h1" fontSize="20px" color="secondary">
                  {t('Opening')} {selected.title}
                </Heading>
                {error ? (
                  <ErrorContent onRetry={() => connectToWallet(selected)} />
                ) : (
                  <Text>{t('Please confirm in %wallet%', { wallet: selected.title })}</Text>
                )}
              </>
            )}
            {selected && !selected.installed && <NotInstalled qrCode={qrCode} wallet={selected} />}
          </AtomBox>
        </AtomBox>
      </TabContainer>
    </ModalV2>
  )
}

const Intro = () => {
  const { t } = useTranslation()
  return (
    <>
      <Heading as="h1" fontSize="20px" color="secondary">
        {t('Haven’t got a wallet yet?')}
      </Heading>
      <Image src="https://cdn.pancakeswap.com/wallets/wallet_intro.png" width={198} height={178} />
      <Button as={LinkExternal} color="backgroundAlt" variant="subtle">
        Learn How to Connect
      </Button>
    </>
  )
}

const NotInstalled = ({ wallet, qrCode }: { wallet: WalletConfigV2; qrCode?: string }) => {
  const { t } = useTranslation()
  return (
    <>
      <Heading as="h1" fontSize="20px" color="secondary">
        {t('%wallet% is not installed', { wallet: wallet.title })}
      </Heading>
      {qrCode && (
        <Suspense>
          <AtomBox overflow="hidden" borderRadius="card" style={{ width: '288px', height: '288px' }}>
            <Qrcode url={qrCode} image={wallet.icon} />
          </AtomBox>
        </Suspense>
      )}
      {!qrCode && (
        <Text maxWidth="246px" m="auto">
          {t('Please install the %wallet% browser extension to connect the %wallet% wallet.', {
            wallet: wallet.title,
          })}
        </Text>
      )}
      {wallet.guide && (
        <Button variant="subtle" as="a" href={getDesktopLink(wallet.guide)} external>
          {getDesktopText(wallet.guide, t('Setup Guide'))}
        </Button>
      )}
      {wallet.downloadLink && (
        <Button variant="subtle" as="a" href={getDesktopLink(wallet.downloadLink)} external>
          {getDesktopText(wallet.downloadLink, t('Install'))}
        </Button>
      )}
    </>
  )
}

const ErrorContent = ({ onRetry }: { onRetry: () => void }) => {
  const { t } = useTranslation()
  return (
    <>
      <Text maxWidth="246px">{t('Error connecting, please authorize wallet to access.')}</Text>
      <Button variant="subtle" onClick={onRetry}>
        {t('Retry')}
      </Button>
    </>
  )
}

const getDesktopLink = (linkDevice: LinkOfDevice) =>
  typeof linkDevice === 'string'
    ? linkDevice
    : typeof linkDevice.desktop === 'string'
    ? linkDevice.desktop
    : linkDevice.desktop?.url

const getDesktopText = (linkDevice: LinkOfDevice, fallback: string) =>
  typeof linkDevice === 'string'
    ? fallback
    : typeof linkDevice.desktop === 'string'
    ? fallback
    : linkDevice.desktop?.text ?? fallback
