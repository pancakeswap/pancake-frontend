import { PredictionConfig } from '@pancakeswap/prediction'
import { Box, Button, CloseIcon, Flex, FlexGap, ModalWrapper, Text } from '@pancakeswap/uikit'
import { TokenImage } from 'components/TokenImage'
import { Price } from 'views/Predictions/components/TokenSelector/Price'
import { useConfig } from 'views/Predictions/context/ConfigProvider'

interface DesktopPredictionTokenSelectorProps {
  tokenListData: PredictionConfig[]
  onDismiss: () => void
  onClickSwitchToken: (tokenSymbol: string) => void
}

export const MobilePredictionTokenSelector: React.FC<React.PropsWithChildren<DesktopPredictionTokenSelectorProps>> = ({
  tokenListData,
  onClickSwitchToken,
  onDismiss,
}) => {
  const config = useConfig()

  return (
    <ModalWrapper minWidth={320} maxHeight="90vh" style={{ overflowY: 'auto' }}>
      <FlexGap flexDirection="column" padding={24} gap="32px">
        <FlexGap justifyContent="space-between" gap="8px" alignItems="flex-start">
          <Flex>
            <Text
              bold
              mr="8px"
              fontSize="20px"
              lineHeight="110%"
              textTransform="uppercase"
              style={{ alignSelf: 'center' }}
            >
              {`${config?.token?.symbol}USD`}
            </Text>
            <Price
              color="secondary"
              displayedDecimals={config?.displayedDecimals}
              chainlinkOracleAddress={config?.chainlinkOracleAddress}
              galetoOracleAddress={config?.galetoOracleAddress}
            />
          </Flex>
          <Button variant="text" onClick={onDismiss} px={0} height="fit-content">
            <CloseIcon color="primary" />
          </Button>
        </FlexGap>
        <Flex width="100%" maxHeight={500} overflowY="auto" flexDirection="column">
          {tokenListData?.map((list) => (
            <Flex
              width="100%"
              padding="8px 0"
              key={list.address}
              justifyContent="space-between"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onClickSwitchToken(list?.token?.symbol)
                onDismiss()
              }}
            >
              <Flex>
                <Box style={{ alignSelf: 'center' }} width={24} height={24} mr="8px">
                  <TokenImage width={24} height={24} token={list?.token} />
                </Box>
                <Text fontSize={20} bold color="textSubtle">{`${list?.token?.symbol}USD`}</Text>
              </Flex>
              <Price
                displayedDecimals={list?.displayedDecimals}
                chainlinkOracleAddress={list?.chainlinkOracleAddress}
                galetoOracleAddress={list?.galetoOracleAddress}
              />
            </Flex>
          ))}
        </Flex>
      </FlexGap>
    </ModalWrapper>
  )
}
