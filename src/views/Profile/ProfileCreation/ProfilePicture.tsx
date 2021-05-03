import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, Card, CardBody, Heading, Skeleton, Text } from '@pancakeswap-libs/uikit'
import { Link as RouterLink } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { getAddressByType } from 'utils/collectibles'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { useTranslation } from 'contexts/Localization'
import { useGetCollectibles } from 'state/hooks'
import useToast from 'hooks/useToast'
import { useERC721 } from 'hooks/useContract'
import SelectionCard from '../components/SelectionCard'
import NextStepButton from '../components/NextStepButton'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'

const Link = styled(RouterLink)`
  color: ${({ theme }) => theme.colors.primary};
`

const NftWrapper = styled.div`
  margin-bottom: 24px;
`

const ProfilePicture: React.FC = () => {
  const [isApproved, setIsApproved] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const { selectedNft, actions } = useContext(ProfileCreationContext)
  const { t } = useTranslation()
  const { isLoading, nftsInWallet, tokenIds } = useGetCollectibles()
  const contract = useERC721(selectedNft.nftAddress)
  const { account } = useWeb3React()
  const { toastError } = useToast()

  const handleApprove = () => {
    contract.methods
      .approve(getPancakeProfileAddress(), selectedNft.tokenId)
      .send({ from: account })
      .once('sending', () => {
        setIsApproving(true)
      })
      .once('receipt', () => {
        setIsApproving(false)
        setIsApproved(true)
      })
      .once('error', (error) => {
        toastError('Error', error?.message)
        setIsApproving(false)
      })
  }

  if (!isLoading && nftsInWallet.length === 0) {
    return (
      <>
        <Heading size="xl" mb="24px">
          {t('Oops!')}
        </Heading>
        <Text bold fontSize="20px" mb="24px">
          {t('We couldn’t find any Pancake Collectibles in your wallet.')}
        </Text>
        <Text as="p">
          {t(
            'You need a Pancake Collectible to finish setting up your profile. If you sold or transferred your starter collectible to another wallet, you’ll need to get it back or acquire a new one somehow. You can’t make a new starter with this wallet address.',
          )}
        </Text>
      </>
    )
  }

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t(`Step ${2}`)}
      </Text>
      <Heading as="h3" size="xl" mb="24px">
        {t('Set Profile Picture')}
      </Heading>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" size="lg" mb="8px">
            {t('Choose collectible')}
          </Heading>
          <Text as="p" color="textSubtle">
            {t('Choose a profile picture from the eligible collectibles (NFT) in your wallet, shown below.')}
          </Text>
          <Text as="p" color="textSubtle" mb="24px">
            {t('Only approved Pancake Collectibles can be used.')}
            <Link to="/collectibles" style={{ marginLeft: '4px' }}>
              {t('See the list >')}
            </Link>
          </Text>
          <NftWrapper>
            {isLoading ? (
              <Skeleton height="80px" mb="16px" />
            ) : (
              nftsInWallet.map((walletNft) => {
                const [firstTokenId] = tokenIds[walletNft.identifier]
                const address = getAddressByType(walletNft.type)

                return (
                  <SelectionCard
                    name="profilePicture"
                    key={walletNft.identifier}
                    value={firstTokenId}
                    image={`/images/nfts/${walletNft.images.md}`}
                    isChecked={firstTokenId === selectedNft.tokenId}
                    onChange={(value: string) => actions.setSelectedNft(parseInt(value, 10), address)}
                  >
                    <Text bold>{walletNft.name}</Text>
                  </SelectionCard>
                )
              })
            )}
          </NftWrapper>
          <Heading as="h4" size="lg" mb="8px">
            {t('Allow collectible to be locked')}
          </Heading>
          <Text as="p" color="textSubtle" mb="16px">
            {t(
              "The collectible you've chosen will be locked in a smart contract while it’s being used as your profile picture. Don't worry - you'll be able to get it back at any time.",
            )}
          </Text>
          <Button
            isLoading={isApproving}
            disabled={isApproved || isApproving || selectedNft.tokenId === null}
            onClick={handleApprove}
            endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : undefined}
          >
            {t('Approve')}
          </Button>
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={selectedNft.tokenId === null || !isApproved || isApproving}>
        {t('Next Step')}
      </NextStepButton>
    </>
  )
}

export default ProfilePicture
