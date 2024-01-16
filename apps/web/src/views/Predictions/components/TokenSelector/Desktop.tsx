import { PredictionConfig } from '@pancakeswap/prediction'
import { Flex, Text } from '@pancakeswap/uikit'
import { TokenImage } from 'components/TokenImage'
import { styled } from 'styled-components'
import { Price } from 'views/Predictions/components/TokenSelector/Price'

const DropDownListContainer = styled(Flex)`
  position: absolute;
  top: 40px;
  left: -1px;
  width: 100.6%;
  cursor: pointer;
  border: ${({ theme }) => `solid 1px ${theme.colors.cardBorder}`};
  border-radius: 0 0 16px 16px;
  background: ${({ theme }) => theme.colors.input};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  border-top-color: ${({ theme }) => theme.colors.inputSecondary};
  max-height: 500px;
  overflow-y: auto;

  &:hover {
    background: ${({ theme }) => theme.colors.inputSecondary};
  }
`

interface DesktopPredictionTokenSelectorProps {
  isOpen: boolean
  tokenListData: PredictionConfig[]
  onClickSwitchToken: (tokenSymbol: string) => void
}

export const DesktopPredictionTokenSelector: React.FC<React.PropsWithChildren<DesktopPredictionTokenSelectorProps>> = ({
  isOpen,
  tokenListData,
  onClickSwitchToken,
}) => {
  return (
    <>
      {isOpen && (
        <DropDownListContainer>
          {tokenListData?.map((list) => (
            <Flex
              width="100%"
              padding="8px 39px 8px 16px"
              key={list.address}
              onClick={() => onClickSwitchToken(list?.token?.symbol)}
            >
              <TokenImage style={{ alignSelf: 'center' }} mr="8px" width={24} height={24} token={list?.token} />
              <Text
                bold
                color="textSubtle"
                fontSize={['20px']}
                textTransform="uppercase"
                style={{ alignSelf: 'center' }}
                mr="auto"
              >
                {`${list?.token?.symbol}USD`}
              </Text>
              <Price
                displayedDecimals={list?.displayedDecimals}
                chainlinkOracleAddress={list?.chainlinkOracleAddress}
                galetoOracleAddress={list?.galetoOracleAddress}
              />
            </Flex>
          ))}
        </DropDownListContainer>
      )}
    </>
  )
}
