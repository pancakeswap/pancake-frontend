/* eslint-disable @typescript-eslint/ban-types */
import { usePreviousValue } from '@pancakeswap/hooks'
import { atom, useAtom } from 'jotai'
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
  Text,
  ErrorIcon,
} from '@pancakeswap/uikit'
import clsx from 'clsx'
import { lazy, PropsWithChildren, Suspense, useState, FC, useMemo } from 'react'
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
  id: string
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
  login: (connectorId: T) => Promise<any>
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

export const IntroSteps = [
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

const errorAtom = atom(false)

const selectedWalletAtom = atom<WalletConfigV2<unknown> | null>(null)

export function useSelectedWallet<T>() {
  // @ts-ignore
  return useAtom<WalletConfigV2<T> | null>(selectedWalletAtom)
}

const Tutorial = () => {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)

  const introStep = IntroSteps[step]

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
      {introStep && (
        <>
          <Heading as="h2" color="secondary">
            {introStep.title}
          </Heading>
          <Image m="auto" src={introStep.icon} width={198} height={178} />
          <Text maxWidth="368px" m="auto" small color="textSubtle">
            {introStep.description}
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

  const [selected, setSelected] = useSelectedWallet<T>()
  const [error, setError] = useAtom(errorAtom)

  const walletsToShow: WalletConfigV2<T>[] = wallets.filter((w) => w.installed || w.deepLink)

  return (
    <ModalV2 width="full" closeOnOverlayClick {...props}>
      <TabContainer>
        <AtomBox width="full">
          {error ? (
            <AtomBox
              display="flex"
              flexDirection="column"
              alignItems="center"
              style={{ gap: '24px' }}
              textAlign="center"
              p="24px"
            >
              {selected && typeof selected.icon === 'string' && <Image src={selected.icon} width={108} height={108} />}
              <Text maxWidth="246px">{t('Error connecting, please authorize wallet to access.')}</Text>
            </AtomBox>
          ) : (
            <Text color="textSubtle" small p="24px">
              {t(
                'Starts connect with one of the wallets below. Manage and store your private keys and assets securely.',
              )}
            </Text>
          )}
          <AtomBox flex={1} py="16px" style={{ maxHeight: '230px' }} overflow="auto">
            <WalletSelect
              displayCount={6}
              wallets={walletsToShow}
              onClick={(wallet) => {
                setSelected(wallet)
                setError(false)
                if (wallet.installed) {
                  login(wallet.connectorId)
                    .then((v) => {
                      if (v) {
                        localStorage.setItem(walletLocalStorageKey, wallet.title)
                      }
                    })
                    .catch(() => {
                      setError(true)
                    })
                } else if (wallet.deepLink) {
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
                <Image src={Icon as string} width={50} height={50} />
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

export const walletLocalStorageKey = 'wallet'

const lastUsedWalletNameAtom = atom<string>('')

lastUsedWalletNameAtom.onMount = (set) => {
  const preferred = localStorage?.getItem(walletLocalStorageKey)
  if (preferred) {
    set(preferred)
  }
}

function sortWallets<T>(wallets: WalletConfigV2<T>[], lastUsedWalletName: string | null) {
  const sorted = wallets.sort((a, b) => {
    if (a.installed) {
      return -1
    }
    if (b.installed) {
      return 1
    }
    return 0
  })

  if (!lastUsedWalletName) {
    return sorted
  }
  const foundLastUsedWallet = wallets.find((w) => w.title === lastUsedWalletName)
  if (!foundLastUsedWallet) return sorted
  return [foundLastUsedWallet, ...sorted.filter((w) => w.id !== foundLastUsedWallet.id)]
}

export function WalletModalV2<T = unknown>(props: WalletModalV2Props<T>) {
  const { wallets: _wallets, login, ...rest } = props

  const [selected, setSelected] = useSelectedWallet<T>()
  const [error, setError] = useAtom(errorAtom)
  const previousWallet = usePreviousValue(selected)
  const [qrCode, setQrCode] = useState<string | undefined>(undefined)
  const [lastUsedWalletName] = useAtom(lastUsedWalletNameAtom)

  const connectToWallet = (wallet: WalletConfigV2<T>) => {
    setError(false)
    if (wallet.installed) {
      login(wallet.connectorId)
        ?.catch(() => {
          setError(true)
        })
        .then(() => {
          localStorage.setItem(walletLocalStorageKey, wallet.title)
        })
    }
  }

  const { t } = useTranslation()

  const wallets = useMemo(() => sortWallets(_wallets, lastUsedWalletName), [_wallets, lastUsedWalletName])

  if (isMobile) {
    return <MobileModal {...props} wallets={wallets} />
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
          <AtomBox display="flex" flexDirection="column" alignItems="center" style={{ gap: '24px' }} textAlign="center">
            {!selected && <Intro />}
            {selected && selected.installed && (
              <>
                {typeof selected.icon === 'string' && <Image src={selected.icon} width={108} height={108} />}
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
            <Qrcode url={qrCode} image={typeof wallet.icon === 'string' ? wallet.icon : undefined} />
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
      <AtomBox display="flex" alignItems="center">
        <ErrorIcon width="16px" />
        <Text bold maxWidth="246px">
          {t('Error connecting, please authorize wallet to access.')}
        </Text>
      </AtomBox>
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
