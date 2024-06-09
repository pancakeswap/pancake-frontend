import { useTranslation } from '@pancakeswap/localization'
import { BinanceIcon, Button, ErrorIcon, Flex, Grid, Image, Input, Text } from '@pancakeswap/uikit'
import { NftToken } from 'hooks/useProfile/nft/types'
import { styled } from 'styled-components'
import { safeGetAddress } from 'utils'
import { useAccount } from 'wagmi'
import { GreyedOutContainer } from './styles'

const RoundedImage = styled(Image)`
  border-radius: ${({ theme }) => theme.radii.small};
  overflow: hidden;
`

const Divider = styled.div`
  margin: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

interface TransferStageProps {
  nftToSell: NftToken
  lowestPrice?: number
  transferAddress: string
  setTransferAddress: React.Dispatch<React.SetStateAction<string>>
  isInvalidTransferAddress: boolean
  continueToNextStage: () => void
}

const TransferStage: React.FC<React.PropsWithChildren<TransferStageProps>> = ({
  nftToSell,
  lowestPrice,
  transferAddress,
  setTransferAddress,
  isInvalidTransferAddress,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const transferAddressEqualsConnectedAddress = safeGetAddress(transferAddress) === safeGetAddress(account)
  const getErrorText = () => {
    if (isInvalidTransferAddress) {
      return t('That’s not a BNB Smart Chain wallet address.')
    }
    if (transferAddressEqualsConnectedAddress) {
      return t('This address is the one that is currently connected')
    }
    return null
  }
  return (
    <>
      <Text fontSize="24px" bold px="16px" pt="16px">
        {t('Transfer to New Wallet')}
      </Text>
      <Flex p="16px">
        <RoundedImage src={nftToSell.image.thumbnail} height={68} width={68} mr="8px" />
        <Grid flex="1" gridTemplateColumns="1fr 1fr" alignItems="center">
          <Text bold>{nftToSell.name}</Text>
          <Text fontSize="12px" color="textSubtle" textAlign="right">
            {nftToSell?.collectionName}
          </Text>
          {lowestPrice && (
            <>
              <Text small color="textSubtle">
                {t('Lowest price')}
              </Text>
              <Flex alignItems="center" justifyContent="flex-end">
                <BinanceIcon width={16} height={16} mr="4px" />
                <Text small>{lowestPrice}</Text>
              </Flex>
            </>
          )}
        </Grid>
      </Flex>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Receiving address')}
        </Text>
        <Input
          scale="sm"
          isWarning={isInvalidTransferAddress || transferAddressEqualsConnectedAddress}
          placeholder={t('Paste BSC address')}
          value={transferAddress}
          onChange={(e) => setTransferAddress(e.target.value)}
        />
        {isInvalidTransferAddress ||
          (transferAddressEqualsConnectedAddress && (
            <Text fontSize="12px" color="failure" mt="4px">
              {getErrorText()}
            </Text>
          ))}
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Text small color="textSubtle">
          {t('This action will send your NFT to the address you have indicated above. Make sure it’s the correct')}
        </Text>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          disabled={isInvalidTransferAddress || transferAddress.length === 0 || transferAddressEqualsConnectedAddress}
        >
          {t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default TransferStage
