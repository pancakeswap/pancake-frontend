import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import {
  AutoColumn,
  Box,
  Button,
  CloseIcon,
  ColumnCenter,
  FlexGap,
  Grid,
  Heading,
  Input,
  ModalV2,
  ModalWrapper,
  Text,
} from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { useState } from 'react'
import styled from 'styled-components'
import { GaugesTable } from '../GaugesTable'
import { Filter, GaugesType, OptionsModal, OptionsType } from './OptionsModal'

const FilterButton = styled(Button)`
  height: 35px;
  border-radius: 18px;
  padding: 0 12px;
`

export const AddGaugeModal = ({ isOpen, onDismiss }) => {
  const { t } = useTranslation()
  const [option, setOption] = useState<OptionsType | null>(null)
  const [filter, setFilter] = useState<Filter>({
    byChain: [],
    byFeeTier: [],
    byType: [],
  })

  const onFilterChange = (type: OptionsType, value: GaugesType | ChainId | FeeAmount) => {
    const opts = filter[type] as Array<unknown>
    if (opts.includes(value)) {
      setFilter((prev) => ({
        ...prev,
        [type]: opts.filter((v) => v !== value),
      }))
    } else {
      setFilter((prev) => ({
        ...prev,
        [type]: [...opts, value],
      }))
    }
  }

  return (
    <>
      <ModalV2 isOpen={isOpen} onDismiss={onDismiss}>
        <ModalWrapper maxHeight="90vh" style={{ overflowY: 'auto' }}>
          <FlexGap flexDirection="column" padding={32} gap="32px">
            <FlexGap justifyContent="space-between" gap="8px" alignItems="flex-start">
              <AutoColumn>
                <Heading>{t('Add Gauges')}</Heading>
                <Text fontSize={14} color="textSubtle">
                  {t('Search and add the gauge you want to vote')}
                </Text>
              </AutoColumn>
              <Button variant="text" onClick={onDismiss} px={0} height="fit-content">
                <CloseIcon color="textSubtle" />
              </Button>
            </FlexGap>
            <Grid gridTemplateColumns="1fr 1fr" gridGap="32px">
              <AutoColumn gap="4px">
                <Text fontSize={12} fontWeight={600} color="textSubtle" textTransform="uppercase">
                  {t('filter')}
                </Text>
                <FlexGap gap="10px">
                  <FilterButton variant="light" onClick={() => setOption(OptionsType.ByChain)}>
                    {t('Chain')}
                  </FilterButton>
                  <FilterButton variant="light" onClick={() => setOption(OptionsType.ByFeeTier)}>
                    {t('Fee Tier')}
                  </FilterButton>
                  <FilterButton variant="light" onClick={() => setOption(OptionsType.ByType)}>
                    {t('Type')}
                  </FilterButton>
                </FlexGap>
              </AutoColumn>
              <AutoColumn gap="4px">
                <Text fontSize={12} fontWeight={600} color="textSubtle" textTransform="uppercase">
                  {t('search')}
                </Text>
                <Input placeholder={t('Search gauges')} />
              </AutoColumn>
            </Grid>
            <Box>
              <GaugesTable scrollStyle={{ maxHeight: '40vh' }} />
            </Box>
            <ColumnCenter style={{ marginTop: 'auto' }}>
              <Button width="50%">{t('Finish')}</Button>
            </ColumnCenter>
          </FlexGap>
        </ModalWrapper>
      </ModalV2>
      <OptionsModal
        isOpen={Boolean(option)}
        onDismiss={() => setOption(null)}
        type={option}
        options={filter}
        onChange={onFilterChange}
      />
    </>
  )
}
