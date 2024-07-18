import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  CurrencyIcon,
  FarmIcon,
  Flex,
  InlineMenu,
  RocketIcon,
  Text,
  Toggle,
  TradeIcon,
} from '@pancakeswap/uikit'
import { useCallback, useEffect, useRef, useState } from 'react'
import { styled } from 'styled-components'

interface FarmTypesFilterProps {
  boostedOnly: boolean
  handleSetBoostedOnly: (value: boolean) => void
  stableSwapOnly: boolean
  handleSetStableSwapOnly: (value: boolean) => void
  v3FarmOnly?: boolean
  handleSetV3FarmOnly?: (value: boolean) => void
  v2FarmOnly?: boolean
  handleSetV2FarmOnly?: (value: boolean) => void
  farmTypesEnableCount: number
  handleSetFarmTypesEnableCount: (value: number) => void
}

export const FarmTypesWrapper = styled(Flex)`
  background: ${({ theme }) => theme.colors.dropdown};
  border-radius: 24px 24px 0 0;
`

export const StyledItemRow = styled(Flex)`
  cursor: pointer;
  user-select: none;
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`

export const FarmTypesFilter: React.FC<FarmTypesFilterProps> = ({
  boostedOnly,
  handleSetBoostedOnly,
  stableSwapOnly,
  handleSetStableSwapOnly,
  v3FarmOnly,
  handleSetV3FarmOnly,
  v2FarmOnly,
  handleSetV2FarmOnly,
  farmTypesEnableCount,
  handleSetFarmTypesEnableCount,
}) => {
  const { t } = useTranslation()

  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const handleMenuClick = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen)
  }, [])

  const handleToggle = useCallback(
    (currentValue, setter) => {
      const totalFarmsEnableCount = farmTypesEnableCount + (!currentValue ? 1 : -1)
      handleSetFarmTypesEnableCount(totalFarmsEnableCount)
      setter(!currentValue)
    },
    [farmTypesEnableCount, handleSetFarmTypesEnableCount],
  )

  useEffect(() => {
    const handleClickOutside = ({ target }: Event) => {
      if (
        wrapperRef.current &&
        menuRef.current &&
        !menuRef.current.contains(target as HTMLElement) &&
        !wrapperRef.current.contains(target as HTMLElement)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [setIsOpen, wrapperRef, menuRef])

  return (
    <Flex alignItems="center" mr="4px" mb="4px">
      <Box ref={wrapperRef}>
        <InlineMenu
          component={
            <Button onClick={handleMenuClick} variant="light" scale="sm">
              {t('Farm Types')}
              {farmTypesEnableCount > 0 && `(${farmTypesEnableCount})`}
            </Button>
          }
          isOpen={isOpen}
          options={{ placement: 'top' }}
        >
          {({ update }) => (
            <Box width={['100%', '345px']} ref={menuRef}>
              <FarmTypesWrapper alignItems="center" p="16px">
                <Text fontSize={20} bold color="text" display="inline-block" ml="8px">
                  {t('Farm Types')}
                </Text>
              </FarmTypesWrapper>
              <Box height="240px" overflowY="auto">
                <StyledItemRow alignItems="center" px="16px" py="8px" ml="8px" mt="8px">
                  <TradeIcon />
                  <Text fontSize={16} ml="10px" style={{ flex: 1 }} bold>
                    {t('V3 Farms')}
                  </Text>
                  <ToggleWrapper>
                    <Toggle
                      id="v3-only-farms"
                      checked={v3FarmOnly}
                      onChange={() => {
                        handleToggle(v3FarmOnly, handleSetV3FarmOnly)
                        update?.()
                      }}
                      scale="sm"
                    />
                  </ToggleWrapper>
                </StyledItemRow>
                <StyledItemRow alignItems="center" px="16px" py="8px" ml="8px" mt="8px">
                  <FarmIcon />
                  <Text fontSize={16} ml="10px" style={{ flex: 1 }} bold>
                    {t('V2 Farms')}
                  </Text>
                  <ToggleWrapper>
                    <Toggle
                      id="v2-only-farms"
                      checked={v2FarmOnly}
                      onChange={() => {
                        handleToggle(v2FarmOnly, handleSetV2FarmOnly)
                        update?.()
                      }}
                      scale="sm"
                    />
                  </ToggleWrapper>
                </StyledItemRow>
                <StyledItemRow alignItems="center" px="16px" py="8px" ml="8px" mt="8px">
                  <RocketIcon />
                  <Text fontSize={16} ml="10px" style={{ flex: 1 }} bold>
                    {t('Booster Available')}
                  </Text>
                  <ToggleWrapper>
                    <Toggle
                      id="boosted-only-farms"
                      checked={boostedOnly}
                      onChange={() => {
                        handleToggle(boostedOnly, handleSetBoostedOnly)
                        update?.()
                      }}
                      scale="sm"
                    />
                  </ToggleWrapper>
                </StyledItemRow>
                <StyledItemRow alignItems="center" px="16px" py="8px" ml="8px" mt="8px">
                  <CurrencyIcon />
                  <Text fontSize={16} ml="10px" style={{ flex: 1 }} bold>
                    {t('StableSwap')}
                  </Text>
                  <ToggleWrapper>
                    <Toggle
                      id="stableSwap-only-farms"
                      checked={stableSwapOnly}
                      onChange={() => {
                        handleToggle(stableSwapOnly, handleSetStableSwapOnly)
                        update?.()
                      }}
                      scale="sm"
                    />
                  </ToggleWrapper>
                </StyledItemRow>
              </Box>
            </Box>
          )}
        </InlineMenu>
      </Box>
    </Flex>
  )
}
