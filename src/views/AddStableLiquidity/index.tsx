import { useTranslation } from '@pancakeswap/localization'
import { CardBody, Message, Text, AddIcon } from '@pancakeswap/uikit'
import { AppBody, AppHeader } from 'components/App'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { AutoColumn, ColumnCenter } from 'components/Layout/Column'
import { CommonBasesType } from 'components/SearchModal/types'
import Page from 'views/Page'
import _noop from 'lodash/noop'
import { CommitButton } from 'components/CommitButton'
import { RowBetween } from 'components/Layout/Row'

const NoLiquidity = () => {
  const { t } = useTranslation()

  return (
    <Message variant="warning">
      <div>
        <Text bold mb="8px">
          {t('You are the first liquidity provider.')}
        </Text>
        <Text mb="8px">{t('The ratio of tokens you add will set the price of this pool.')}</Text>
        <Text>{t('Once you are happy with the rate click supply to review.')}</Text>
      </div>
    </Message>
  )
}

export default function AddStableLiquidity() {
  const { t } = useTranslation()

  const allowedSlippage = 200

  return (
    <Page>
      <AppBody>
        <AppHeader
          title={t('Add Stable Liquidity')}
          subtitle={t('Receive LP tokens and earn 0.17% trading fees')}
          helper={t(
            'Liquidity providers earn a 0.17% trading fee on all trades made for that token pair, proportional to their share of the liquidity pool.',
          )}
          backTo="/liquidity"
        />
        <CardBody>
          <AutoColumn gap="20px">
            {/* <ColumnCenter>
              <NoLiquidity />
            </ColumnCenter> */}
            <CurrencyInputPanel
              showBUSD
              onCurrencySelect={_noop}
              zapStyle="noZap"
              value="0"
              onUserInput={_noop}
              onMax={_noop}
              showMaxButton={false}
              id="add-stable-liquidity-input-tokena"
              showCommonBases
              commonBasesType={CommonBasesType.LIQUIDITY}
            />
          </AutoColumn>
          <ColumnCenter>
            <AddIcon width="16px" />
          </ColumnCenter>
          <CurrencyInputPanel
            showBUSD
            onCurrencySelect={_noop}
            zapStyle="noZap"
            value="0"
            onUserInput={_noop}
            onMax={_noop}
            showMaxButton={false}
            id="add-stable-liquidity-outpuy-tokena"
            showCommonBases
            commonBasesType={CommonBasesType.LIQUIDITY}
          />

          <RowBetween>
            <Text bold fontSize="12px" color="secondary">
              {t('Slippage Tolerance')}
            </Text>
            <Text bold color="primary">
              {allowedSlippage / 100}%
            </Text>
          </RowBetween>

          <AutoColumn gap="md">
            <CommitButton onClick={_noop} disabled={false}>
              {t('Supply')}
            </CommitButton>
          </AutoColumn>
        </CardBody>
      </AppBody>
    </Page>
  )
}
