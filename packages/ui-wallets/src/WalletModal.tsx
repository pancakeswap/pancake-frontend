/* eslint-disable @typescript-eslint/ban-types */
import { usePreviousValue } from '@pancakeswap/hooks'
import { AtomBox } from '@pancakeswap/ui/components/AtomBox'
import { Button, Heading, LinkExternal, ModalV2, ModalV2Props, Tab, TabMenu } from '@pancakeswap/uikit'
import { Text } from '@pancakeswap/uikit/src/components/Text'
import { PropsWithChildren, useState } from 'react'
import { WalletIntro } from './components/Icons/WalletIntro'
import { WordLock } from './components/Icons/WordLock'
import {
  desktopWalletSelectionClass,
  modalWrapperClass,
  walletButtonVariants,
  walletSelectWrapperClass,
} from './WalletModal.css'

type LinkOfTextAndLink = string | { text: string; url: string }

type DeviceLink = {
  desktop?: LinkOfTextAndLink
  mobile?: LinkOfTextAndLink
}

type LinkOfDevice = string | DeviceLink

export interface WalletConfigV2<T = unknown> {
  title: string
  icon: any
  connectorId: T
  href?: string
  installed?: boolean
  guide?: LinkOfDevice
  downloadLink?: LinkOfDevice
  noMobile?: boolean
}

interface WalletModalV2Props<T = unknown> extends ModalV2Props {
  defaultWallets: WalletConfigV2<T>[]
  moreWallets?: WalletConfigV2<T>[]
  login: (connectorId: T) => Promise<void>
}

const StepDot = ({ active, place, onClick }: { active: boolean; place: 'left' | 'right'; onClick: () => void }) => (
  <AtomBox
    bgc={active ? 'secondary' : 'inputSecondary'}
    width="56px"
    height="8px"
    onClick={onClick}
    cursor="pointer"
    borderLeftRadius={place === 'left' ? 'card' : '0'}
    borderRightRadius={place === 'right' ? 'card' : '0'}
  />
)

const steps = [
  {
    title: 'Your first step entering the defi world',
    icon: WalletIntro,
    description:
      'A Web3 Wallet allows you to send and receive crypto assets like bitcoin, BNB, ETH, NFTs and much more.',
  },
  {
    title: 'Login using wallet connection',
    icon: WordLock,
    description:
      'Instead of setting up new accounts and passwords for every website, simply connect your wallet in one go.',
  },
]

const Tutorial = () => {
  const [step, setStep] = useState(0)

  const s = steps[step]

  const Icon = s?.icon

  return (
    <AtomBox
      display="flex"
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
          <Icon m="auto" />
          <Text maxWidth="368px" m="auto" small color="textSubtle">
            {s.description}
          </Text>
        </>
      )}
      <AtomBox display="flex" style={{ gap: '4px' }}>
        <StepDot place="left" active={step === 0} onClick={() => setStep(0)} />
        <StepDot place="right" active={step === 1} onClick={() => setStep(1)} />
      </AtomBox>
      <Button variant="subtle" external as={LinkExternal} color="backgroundAlt">
        Learn How to Connect
      </Button>
    </AtomBox>
  )
}

const TabContainer = ({ children }: PropsWithChildren) => {
  const [index, setIndex] = useState(0)

  return (
    <AtomBox position="relative" zIndex="modal">
      <AtomBox position="absolute" style={{ top: '-50px' }}>
        <TabMenu activeIndex={index} onItemClick={setIndex} gap="16px">
          <Tab>Connect Wallet</Tab>
          <Tab>{`What's Web3 Wallet`}</Tab>
        </TabMenu>
      </AtomBox>
      <AtomBox
        display="flex"
        position="relative"
        background="gradientCardHeader"
        borderRadius="card"
        zIndex="modal"
        className={modalWrapperClass}
      >
        {index === 0 && children}
        {index === 1 && <Tutorial />}
      </AtomBox>
    </AtomBox>
  )
}

export function WalletModalV2<T = unknown>(props: WalletModalV2Props<T>) {
  const { defaultWallets } = props

  const [selected, setSelected] = useState<WalletConfigV2<T> | null>(null)
  const [error, setError] = useState(false)
  const previousWallet = usePreviousValue(selected)

  const connectToWallet = (wallet: WalletConfigV2<T>) => {
    setError(false)
    if (wallet.installed) {
      props.login(wallet.connectorId)?.catch(() => {
        setError(true)
      })
    }
  }

  return (
    <ModalV2 {...props}>
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
              Connect Wallet
            </Heading>
            <Text color="textSubtle" small pt="24px" pb="32px">
              Starts connect with one of the wallets below. Manage and store your private keys and assets securely.
            </Text>
          </AtomBox>
          <AtomBox display="grid" overflowY="auto" overflowX="hidden" px="48px" className={walletSelectWrapperClass}>
            {defaultWallets.map((wallet) => {
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
                  onClick={() => {
                    setSelected(wallet)
                    if (previousWallet?.connectorId !== wallet.connectorId) {
                      connectToWallet(wallet)
                    }
                  }}
                >
                  <Icon
                    className={walletButtonVariants({ selected: wallet.title === selected?.title })}
                    width="50px"
                    mb="8px"
                  />
                  <Text fontSize="12px" textAlign="center">
                    {wallet.title}
                  </Text>
                </Button>
              )
            })}
          </AtomBox>
        </AtomBox>
        <AtomBox flex={1} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
          <AtomBox display="grid" style={{ maxWidth: '246px', gap: '24px' }} textAlign="center">
            {!selected && <Intro />}
            {selected && selected.installed && (
              <>
                <Heading as="h1" fontSize="20px" color="secondary">
                  Opening {selected.title}
                </Heading>
                {error ? (
                  <ErrorContent onRetry={() => connectToWallet(selected)} />
                ) : (
                  <Text>Please confirm in {selected.title}</Text>
                )}
              </>
            )}
            {selected && !selected.installed && <NotInstalled wallet={selected} />}
          </AtomBox>
        </AtomBox>
      </TabContainer>
    </ModalV2>
  )
}

const Intro = () => (
  <>
    <Heading as="h1" fontSize="20px" color="secondary">
      Haven’t got a wallet yet?
    </Heading>
    <WalletIntro />
    <Button as={LinkExternal} color="backgroundAlt" variant="subtle">
      Learn How to Connect
    </Button>
  </>
)

const NotInstalled = ({ wallet }: { wallet: WalletConfigV2 }) => (
  <>
    <Heading as="h1" fontSize="20px" color="secondary">
      {wallet.title} is not installed
    </Heading>
    <Text>
      Please install the {wallet.title} browser extension to connect the {wallet.title} wallet.
    </Text>
    {wallet.guide && (
      <Button variant="subtle" as="a" href={getDesktopLink(wallet.guide)} external>
        {getDesktopText(wallet.guide, 'Setup Guide')}
      </Button>
    )}
    {wallet.downloadLink && (
      <Button variant="subtle" as="a" href={getDesktopLink(wallet.downloadLink)} external>
        {getDesktopText(wallet.downloadLink, 'Install')}
      </Button>
    )}
  </>
)

const ErrorContent = ({ onRetry }: { onRetry: () => void }) => (
  <>
    <Text>Error connecting, please authorize wallet to access.</Text>
    <Button variant="subtle" onClick={onRetry}>
      Retry
    </Button>
  </>
)

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
