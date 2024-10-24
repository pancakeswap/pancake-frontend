import { useTranslation } from '@pancakeswap/localization'
import {
  AtomBox,
  AutoColumn,
  Flex,
  Message,
  MessageText,
  PancakeToggle,
  PreTitle,
  QuestionHelper,
  Text,
  Toggle,
} from '@pancakeswap/uikit'
import { useUserSingleHopOnly } from '@pancakeswap/utils/user'
import { PancakeSwapXTag } from 'components/PancakeSwapXTag'
import { usePCSX, usePCSXFeatureEnabled } from 'hooks/usePCSX'
import { useSpeedQuote } from 'hooks/useSpeedQuote'
import { memo } from 'react'
import {
  useOnlyOneAMMSourceEnabled,
  useUserSplitRouteEnable,
  useUserStableSwapEnable,
  useUserV2SwapEnable,
  useUserV3SwapEnable,
} from 'state/user/smartRouter'
import { TabContent } from './TabContent'

export const CustomizeRoutingTab = memo(() => {
  const { t } = useTranslation()

  const xFeatureEnabled = usePCSXFeatureEnabled()
  const [isStableSwapByDefault, setIsStableSwapByDefault] = useUserStableSwapEnable()
  const [v2Enable, setV2Enable] = useUserV2SwapEnable()
  const [v3Enable, setV3Enable] = useUserV3SwapEnable()
  const [xEnable, setXEnable] = usePCSX()
  const [split, setSplit] = useUserSplitRouteEnable()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  const [speedQuote, setSpeedQuote] = useSpeedQuote()
  const onlyOneAMMSourceEnabled = useOnlyOneAMMSourceEnabled()

  return (
    <TabContent type="to_right">
      <AutoColumn
        width={{
          xs: '100%',
          md: '420px',
        }}
        gap="16px"
        mx="auto"
      >
        <PreTitle>{t('Liquidity source')}</PreTitle>

        {xFeatureEnabled ? (
          <Flex justifyContent="space-between" alignItems="flex-start" mb="24px">
            <Flex flexDirection="column">
              <PancakeSwapXTag />
              <Text fontSize="12px" color="textSubtle" maxWidth={360} mt={10}>
                {t(
                  'When applicable, aggregates liquidity to provide better price, more token options, and gas free swaps.',
                )}
              </Text>
            </Flex>
            <PancakeToggle
              id="stable-swap-toggle"
              scale="md"
              checked={xEnable}
              onChange={() => {
                setXEnable((s) => !s)
              }}
            />
          </Flex>
        ) : null}
        <AtomBox>
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
              disabled={v3Enable && onlyOneAMMSourceEnabled}
              scale="md"
              checked={v3Enable}
              onChange={() => setV3Enable((s) => !s)}
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
              disabled={v2Enable && onlyOneAMMSourceEnabled}
              scale="md"
              checked={v2Enable}
              onChange={() => setV2Enable((s) => !s)}
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
            <Toggle
              disabled={isStableSwapByDefault && onlyOneAMMSourceEnabled}
              id="stable-swap-toggle"
              scale="md"
              checked={isStableSwapByDefault}
              onChange={() => {
                setIsStableSwapByDefault((s) => !s)
              }}
            />
          </Flex>
          {onlyOneAMMSourceEnabled && (
            <Message variant="warning">
              <MessageText>
                {t('At least one AMM liquidity source has to be enabled to support normal trading.')}
              </MessageText>
            </Message>
          )}
        </AtomBox>
        <AtomBox>
          <PreTitle mb="24px">{t('Routing preference')}</PreTitle>
          <Flex justifyContent="space-between" alignItems="center" mb="24px">
            <Flex alignItems="center">
              <Text>{t('Fast routing (BETA)')}</Text>
              <QuestionHelper text={t('Increase the speed of finding best swapping routes')} placement="top" ml="4px" />
            </Flex>
            <Toggle id="toggle-speed-quote" checked={speedQuote} onChange={() => setSpeedQuote((s) => !s)} scale="md" />
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" mb="24px">
            <Flex>
              <Text>{t('Allow Multihops')}</Text>
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
            </Flex>

            <Toggle
              id="toggle-disable-multihop-button"
              checked={!singleHopOnly}
              scale="md"
              onChange={() => {
                setSingleHopOnly((s) => !s)
              }}
            />
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" mb="24px">
            <Flex>
              <Text>{t('Allow Split Routing')}</Text>
              <QuestionHelper
                text={
                  <Flex flexDirection="column">
                    <Text mr="5px">
                      {t(
                        'Split routing enables token swaps to be broken into multiple routes to achieve the best deal.',
                      )}
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
            </Flex>

            <Toggle
              id="toggle-disable-multihop-button"
              checked={split}
              scale="md"
              onChange={() => {
                setSplit((s) => !s)
              }}
            />
          </Flex>
        </AtomBox>
      </AutoColumn>
    </TabContent>
  )
})
