import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import {
  Flex,
  InjectedModalProps,
  Link,
  Modal,
  ExpertModal,
  PancakeToggle,
  QuestionHelper,
  Text,
  ThemeSwitcher,
  Toggle,
  Button,
  ModalV2,
  PreTitle,
  AutoColumn,
  Message,
  MessageText,
  NotificationDot,
  ButtonProps,
  Checkbox,
  AutoRow,
  RowFixed,
  Box,
  ModalTitle,
  Heading,
  ModalCloseButton,
  SearchInput,
  FlexGap,
  Select,
  CogIcon,
  IconButton,
  ModalProps,
  ArrowBackIcon,
} from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import { ReactNode, useCallback, useState } from 'react'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import {
  useAudioPlay,
  useExpertMode,
  useUserSingleHopOnly,
  useUserExpertModeAcknowledgement,
} from '@pancakeswap/utils/user'
import { useSubgraphHealthIndicatorManager, useUserUsernameVisibility } from 'state/user/hooks'
import { useUserTokenRisk } from 'state/user/hooks/useUserTokenRisk'
import {
  useOnlyOneAMMSourceEnabled,
  useUserSplitRouteEnable,
  useUserStableSwapEnable,
  useUserV2SwapEnable,
  useUserV3SwapEnable,
  useRoutingSettingChanged,
} from 'state/user/smartRouter'
import { AtomBox } from '@pancakeswap/ui'
import { useMMLinkedPoolByDefault } from 'state/user/mmLinkedPool'
import styled from 'styled-components'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import { FormHeader } from 'views/Swap/V3Swap/containers'
import Divider from 'components/Divider'
import Image from 'next/image'

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  height: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: 90vh;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: none;
  }
`

const ModalBackButton: React.FC<React.PropsWithChildren<{ onBack: ModalProps["onBack"], isSettings: boolean }>> = ({ onBack, isSettings }) => {
      return (
        <IconButton variant="text" onClick={onBack} area-label="go back" mr="8px">
         
          {isSettings ?  <ArrowBackIcon color="primary" /> : <CogIcon color="primary" />}
        </IconButton>
      );
    };

export const ModalHeader = styled.div<{ background?: string }>`
  align-items: center;
  background: transparent;
  display: flex;
  padding: 12px;

  ${({ theme }) => theme.mediaQueries.md} {
    background: ${({ background }) => background || "transparent"};
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  juxtify-content: space-between;
  align-items: center;
  width: 100%;
//   padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 150%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
`

export const withCustomOnDismiss =
  (Component) =>
  ({
    onDismiss,
    customOnDismiss,
    mode,
    ...props
  }: {
    onDismiss?: () => void
    customOnDismiss: () => void
    mode: SettingsMode
  }) => {
    const handleDismiss = useCallback(() => {
      onDismiss?.()
      if (customOnDismiss) {
        customOnDismiss()
      }
    }, [customOnDismiss, onDismiss])

    return <Component {...props} mode={mode} onDismiss={handleDismiss} />
  }

const NotificationSettings = () => {
      const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgement()
  const [expertMode, setExpertMode] = useExpertMode()
  const [audioPlay, setAudioMode] = useAudioPlay()
  const [subgraphHealth, setSubgraphHealth] = useSubgraphHealthIndicatorManager()
  const [userUsernameVisibility, setUserUsernameVisibility] = useUserUsernameVisibility()
  const { onChangeRecipient } = useSwapActionHandlers()
  const { chainId } = useActiveChainId()

  const mode='he'
  const [tokenRisk, setTokenRisk] = useUserTokenRisk()
      const { isDark, setTheme } = useTheme()
   
      return (
            <ScrollableContainer>
        {mode === SettingsMode.GLOBAL && (
          <>
            <Flex pb="24px" flexDirection="column">
              <PreTitle mb="24px">{t('Global')}</PreTitle>
              <Flex justifyContent="space-between" mb="24px">
                <Text>{t('Dark mode')}</Text>
                <ThemeSwitcher isDark={isDark} toggleTheme={() => setTheme(isDark ? 'light' : 'dark')} />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mb="24px">
                <Flex alignItems="center">
                  <Text>{t('Subgraph Health Indicator')}</Text>
                  <QuestionHelper
                    text={t(
                      'Turn on subgraph health indicator all the time. Default is to show the indicator only when the network is delayed',
                    )}
                    placement="top"
                    ml="4px"
                  />
                </Flex>
                <Toggle
                  id="toggle-subgraph-health-button"
                  checked={subgraphHealth}
                  scale="md"
                  onChange={() => {
                    setSubgraphHealth(!subgraphHealth)
                  }}
                />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mb="24px">
                <Flex alignItems="center">
                  <Text>{t('Show username')}</Text>
                  <QuestionHelper text={t('Shows username of wallet instead of bunnies')} placement="top"  />
                </Flex>
                <Toggle
                  id="toggle-username-visibility"
                  checked={userUsernameVisibility}
                  scale="md"
                  onChange={() => {
                    setUserUsernameVisibility(!userUsernameVisibility)
                  }}
                />
              </Flex>
              {chainId === ChainId.BSC && (
                <>
                  <Flex justifyContent="space-between" alignItems="center" mb="24px">
                    <Flex alignItems="center">
                      <Text>{t('Token Risk Scanning')}</Text>
                      <QuestionHelper
                        text={
                          <>
                            <Text>{t('Automatic risk scanning for the selected token')}</Text>
                            <Text as="span">{t('Risk scan results are provided by a third party')}</Text>
                            <Link style={{ display: 'inline' }} ml="4px" external href="https://www.avengerdao.org">
                              AvengerDAO
                            </Link>
                            <Text my="8px">
                              {t(
                                'It is a tool for indicative purposes only to allow users to check the reference risk level of a BNB Chain Smart Contract. Please do your own research - interactions with any BNB Chain Smart Contract is at your own risk.',
                              )}
                            </Text>
                          </>
                        }
                        placement="top"
                        ml="4px"
                      />
                    </Flex>
                    <Toggle
                      id="toggle-username-visibility"
                      checked={tokenRisk}
                      scale="md"
                      onChange={() => {
                        setTokenRisk(!tokenRisk)
                      }}
                    />
                  </Flex>
                  {/* <GasSettings /> */}
                </>
              )}
            </Flex>
          </>
        )}
        {mode !== SettingsMode.SWAP_LIQUIDITY && (
          <>
            <Flex  flexDirection="column">
              <Text fontWeight='bold' fontSize='16px'>{t('Notification Title')}</Text>
              <Flex justifyContent="space-between" alignItems="center" mb="16px">
                {/* {chainId === ChainId.BSC && <GasSettings />} */}
              </Flex>
              {/* <TransactionSettings /> */}
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" mb="16px">
              <Flex alignItems="center">
                <Text color='textSubtle'>{t('Wallet connect notifications')}</Text>
                <QuestionHelper
                  text={t('Bypasses confirmation modals and allows high slippage trades. Use at your own risk.')}
                  placement="top"
                  ml="4px"
                />
              </Flex>
              <Toggle
                id="toggle-expert-mode-button"
                scale="md"
                checked={expertMode}
            //     onChange={handleExpertModeToggle}
              />
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" mb="8px">
              <Flex alignItems="center">
              <Text color='textSubtle'>{t('Farm pool notifications')}</Text>

                <QuestionHelper
                  text={t('Fun sounds to make a truly immersive pancake-flipping trading experience')}
                  placement="top"
                  ml="4px"
                />
              </Flex>
              <PancakeToggle checked={audioPlay} onChange={() => setAudioMode((s) => !s)} scale="md" />
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" mb="8px">
              <Flex alignItems="center">
              <Text fontWeight='bold'>{t('LP V2')}</Text>

                <QuestionHelper
                  text={t('Fun sounds to make a truly immersive pancake-flipping trading experience')}
                  placement="top"
                  ml="4px"
                />
              </Flex>
              <PancakeToggle checked={audioPlay} onChange={() => setAudioMode((s) => !s)} scale="md" />
            </Flex>
            <Box>
            <Divider/>
            <Flex flexDirection="column" mt='8px'>
              <Text fontWeight='bold' fontSize='16px'>{t('Notification Title')}</Text>
              <Flex justifyContent="space-between" alignItems="center">
                {/* {chainId === ChainId.BSC && <GasSettings />} */}
              </Flex>
              {/* <TransactionSettings /> */}
            </Flex>
            <Flex  justifyContent="space-between" alignItems="center" mb="16px">
              <Flex alignItems="center" maxWidth='80%'>
                <Text color='textSubtle'>{t('ive Farm V3 notifications to keep track of your LP positions')}</Text>
              </Flex>
              <Toggle
                id="toggle-expert-mode-button"
                scale="md"
                checked={expertMode}
            //     onChange={handleExpertModeToggle}
              />
            </Flex>

            <Divider/>
            <Flex flexDirection="column" mt='8px'>
              <Text fontWeight='bold' fontSize='16px'>{t('Notification Title')}</Text>
              <Flex justifyContent="space-between" alignItems="center">
                {/* {chainId === ChainId.BSC && <GasSettings />} */}
              </Flex>
              {/* <TransactionSettings /> */}
            </Flex>
            <Flex  justifyContent="space-between" alignItems="center" mb="16px">
              <Flex alignItems="center" maxWidth='80%'>
                <Text color='textSubtle'>{t('live Farm V3 notifications to keep track of your LP positions')}</Text>
              </Flex>
              <Toggle
                id="toggle-expert-mode-button"
                scale="md"
                checked={expertMode}
            //     onChange={handleExpertModeToggle}
              />
            </Flex>
            </Box>
            <Box>
            <Message  mb="16px" variant="warning" padding='8px'>
            <MessageText>
              {t(
                'Please sign again to apprve changes in wallet!',
              )}{' '}
            </MessageText>
          </Message>
          <Button  variant='primary' width='100%'>{'Enable (Subscribe in wallet)'}</Button>
            </Box>
            
          </>
        )}
      </ScrollableContainer>
      )
}
const SettingsModal = () => {
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgement()
  const [expertMode, setExpertMode] = useExpertMode()
  const [audioPlay, setAudioMode] = useAudioPlay()
  const [subgraphHealth, setSubgraphHealth] = useSubgraphHealthIndicatorManager()
  const [userUsernameVisibility, setUserUsernameVisibility] = useUserUsernameVisibility()
  const { onChangeRecipient } = useSwapActionHandlers()
  const { chainId } = useActiveChainId()
  const mode='he'
  const [tokenRisk, setTokenRisk] = useUserTokenRisk()

  const { t } = useTranslation()
  const { isDark, setTheme } = useTheme()

  if (showConfirmExpertModal) {
    return (
      <ExpertModal
        setShowConfirmExpertModal={setShowConfirmExpertModal}
        onDismiss={() => null}
        toggleExpertMode={() => setExpertMode((s) => !s)}
        setShowExpertModeAcknowledgement={setShowExpertModeAcknowledgement}
      />
    )
  }

  const handleExpertModeToggle = () => {
    if (expertMode || !showExpertModeAcknowledgement) {
      onChangeRecipient(null)
      setExpertMode((s) => !s)
    } else {
      setShowConfirmExpertModal(true)
    }
  }

  return (
      <>
           <ModalHeader>
        <ModalTitle>
          {<ModalBackButton onBack={() => null} isSettings={false}/>}
        
         
          <Heading fontSize='20px' padding='0px'>{'Notification Settings'}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={() => null} />
      </ModalHeader>
      <Box paddingX='24px' paddingBottom='24px'>
            <AutoRow marginBottom='32px'>
            <FilterContainer  >
            <LabelWrapper style={{ width: '85px' }}>
              <Text textTransform="uppercase">{t('All')}</Text>
              <Select
              
                options={[
                  {
                    label: t('All'),
                    value: 'all',
                  },
                  {
                    label: t('Farms'),
                    value: 'farms',
                  },
                  {
                    label: t('LP'),
                    value: 'lp',
                  },
                ]}
                onOptionChange={() => null}
              />
            </LabelWrapper>
            <LabelWrapper style={{  marginLeft: 16, width: '85px' }}>
              <Text textTransform="uppercase">{t('Search')}</Text>
              <SearchInput initialValue={'normalizedUrlSearch'} onChange={() => null} placeholder="Search Farms" />
            </LabelWrapper>
          </FilterContainer>
          
            </AutoRow>
            <Box marginBottom={'56px'} >
            <Flex alignItems='center' justifyContent='center' height='140px'>
            <Image src={'/Group883379635.png'} href='#' height={100} width={100}/>
            </Flex>
           
        
         <FlexGap rowGap='16px' flexDirection='column' justifyContent='center' alignItems='center'>
            <Text fontSize='24px' fontWeight='600' lineHeight='120%' textAlign='center'>All Set</Text>
            <Text fontSize='12px'  textAlign='center' color='textSubtle'>Any notifications that you recieve will appear here. you willl also recieve moblile notification on your mobile wallet. Note you may periodically have to reconnect to establis a connection.</Text>
         </FlexGap>
         </Box>
      </Box>
      </>
  )
}

export default SettingsModal

export function RoutingSettingsButton({
  children,
  showRedDot = true,
  buttonProps,
}: {
  children?: ReactNode
  showRedDot?: boolean
  buttonProps?: ButtonProps
}) {
  const [show, setShow] = useState(false)
  const { t } = useTranslation()
  const [isRoutingSettingChange] = useRoutingSettingChanged()
  return (
    <>
      <AtomBox textAlign="center">
        <NotificationDot show={isRoutingSettingChange && showRedDot}>
          <Button variant="text" onClick={() => setShow(true)} scale="sm" {...buttonProps}>
            {children || t('Customize Routing')}
          </Button>
        </NotificationDot>
      </AtomBox>
      <Box padding='24px'>
        <RoutingSettings />
        </Box>
    </>
  )
}

function RoutingSettings() {
  const { t } = useTranslation()

  return (
      <Box padding='24px'>
      <AutoColumn
        width={{
          xs: '100%',
          md: 'screenSm',
        }}
        gap="16px"
      >
        <AtomBox>
          <PreTitle mb="24px">{t('Liquidity source')}</PreTitle>
          <Flex justifyContent="space-between" alignItems="center" mb="24px">
            <Flex alignItems="center">
              <Text>PancakeSwap V3</Text>
              <QuestionHelper
                text={
                  <Flex>
                    <Text mr="5px">
                      {t(
                        'V3 offers concentrated liquidity to provide deeper liquidity for traders with the same amount of capital, offering lower slippage and more flexible trading fee tiers.',
                      )}
                    </Text>
                  </Flex>
                }
                placement="top"
                ml="4px"
              />
            </Flex>
            <Toggle
              disabled={false}
              scale="md"
              checked={true}
            //   onChange={() => setV3Enable((s) => !s)}
            />
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" mb="24px">
            <Flex alignItems="center">
              <Text>PancakeSwap V2</Text>
              <QuestionHelper
                text={
                  <Flex flexDirection="column">
                    <Text mr="5px">
                      {t('The previous V2 exchange is where a number of iconic, popular assets are traded.')}
                    </Text>
                    <Text mr="5px" mt="1em">
                      {t('Recommend leaving this on to ensure backward compatibility.')}
                    </Text>
                  </Flex>
                }
                placement="top"
                ml="4px"
              />
            </Flex>
            <Toggle
               disabled={false}
               scale="md"
               checked={true}
            //   onChange={() => setV2Enable((s) => !s)}
            />
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" mb="24px">
            <Flex alignItems="center">
              <Text>PancakeSwap {t('StableSwap')}</Text>
              <QuestionHelper
                text={
                  <Flex flexDirection="column">
                    <Text mr="5px">
                      {t(
                        'StableSwap provides higher efficiency for stable or pegged assets and lower fees for trades.',
                      )}
                    </Text>
                  </Flex>
                }
                placement="top"
                ml="4px"
              />
            </Flex>
            <PancakeToggle
               disabled={false}
               scale="md"
               checked={true}
            //   checked={isStableSwapByDefault}
            //   onChange={() => {
            //     setIsStableSwapByDefault((s) => !s)
            //   }}
            />
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" mb="24px">
            <Flex alignItems="center">
              <Text>{`PancakeSwap ${t('MM Linked Pool')}`}</Text>
              <QuestionHelper
                text={
                  <Flex flexDirection="column">
                    <Text mr="5px">{t('Trade through the market makers if they provide better deal')}</Text>
                    <Text mr="5px" mt="1em">
                      {t(
                        'If a trade is going through market makers, it will no longer route through any traditional AMM DEX pools.',
                      )}
                    </Text>
                  </Flex>
                }
                placement="top"
                ml="4px"
              />
            </Flex>
            <Toggle
              disabled={false}
              scale="md"
              checked={true}
            />
          </Flex>
          {/* {onlyOneAMMSourceEnabled && (
            <Message variant="warning">
              <MessageText>
                {t('At least one AMM liquidity source has to be enabled to support normal trading.')}
              </MessageText>
            </Message>
          )} */}
        </AtomBox>
        <AtomBox>
          <PreTitle mb="24px">{t('Routing preference')}</PreTitle>
          <AutoRow alignItems="center" mb="24px">
            {/* <RowFixed as="label" gap="16px">
              <Checkbox
                id="toggle-disable-multihop-button"
                checked={!singleHopOnly}
                scale="sm"
                onChange={() => {
                  setSingleHopOnly((s) => !s)
                }}
              />
              <Text>{t('Allow Multihops')}</Text>
            </RowFixed> */}
            <QuestionHelper
              text={
                <Flex flexDirection="column">
                  <Text mr="5px">
                    {t(
                      'Multihops enables token swaps through multiple hops between several pools to achieve the best deal.',
                    )}
                  </Text>
                  <Text mr="5px" mt="1em">
                    {t(
                      'Turning this off will only allow direct swap, which may cause higher slippage or even fund loss.',
                    )}
                  </Text>
                </Flex>
              }
              placement="top"
              ml="4px"
            />
          </AutoRow>
          <AutoRow alignItems="center" mb="24px">
            <RowFixed alignItems="center" as="label" gap="16px">
              <Checkbox
                 disabled={false}
                 scale="md"
                 checked={true}
            //     onChange={() => {
            //       setSplit((s) => !s)
            //     }}
              />
              <Text>{t('Allow Split Routing')}</Text>
            </RowFixed>
            <QuestionHelper
              text={
                <Flex flexDirection="column">
                  <Text mr="5px">
                    {t('Split routing enables token swaps to be broken into multiple routes to achieve the best deal.')}
                  </Text>
                  <Text mr="5px" mt="1em">
                    {t(
                      'Turning this off will only allow a single route, which may result in low efficiency or higher slippage.',
                    )}
                  </Text>
                </Flex>
              }
              placement="top"
              ml="4px"
            />
          </AutoRow>
        </AtomBox>
      </AutoColumn>
      </Box>
  )
}
