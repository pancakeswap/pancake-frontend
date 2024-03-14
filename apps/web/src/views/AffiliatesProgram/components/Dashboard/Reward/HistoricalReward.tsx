import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useCatchTxError from 'hooks/useCatchTxError'
import { useAffiliateProgramContract } from 'hooks/useContract'
import { useState } from 'react'
import SingleHistoricalReward from 'views/AffiliatesProgram/components/Dashboard/Reward/SingleHistoricalReward'
import WrongNetworkWarning from 'views/AffiliatesProgram/components/Dashboard/Reward/WrongNetworkWarning'
import useAffiliateClaimList from 'views/AffiliatesProgram/hooks/useAffiliateClaimList'
import useUserClaimList, { ClaimDetail } from 'views/AffiliatesProgram/hooks/useUserClaimList'
import { useAccount } from 'wagmi'

interface HistoricalRewardProps {
  isAffiliate: boolean
}

const HistoricalReward: React.FC<React.PropsWithChildren<HistoricalRewardProps>> = ({ isAffiliate }) => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { chainId } = useActiveChainId()
  const { toastSuccess, toastError } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()
  const contract = useAffiliateProgramContract({ chainId: ChainId.BSC })

  const [affiliateDataCurrentPage, setAffiliateDataCurrentPage] = useState(1)
  const [userDataCurrentPage, setUserDataCurrentPage] = useState(1)
  const {
    data: affiliateClaimData,
    isFetching: affiliateIsFetching,
    mutate: affiliateClaimDataRefresh,
  } = useAffiliateClaimList({
    currentPage: affiliateDataCurrentPage,
  })
  const {
    data: userClaimData,
    isFetching: userIsFetching,
    mutate: userClaimDataRefresh,
  } = useUserClaimList({ currentPage: userDataCurrentPage })

  const handleClickClaim = async (isAffiliateClaim: boolean, reward: ClaimDetail) => {
    try {
      const currentTime = new Date().getTime()
      if (currentTime > new Date(reward.expiryTime ?? 0).getTime()) {
        const url = isAffiliateClaim ? 'affiliate-regenerate-signature' : 'user-regenerate-signature'
        const response = await fetch(`/api/affiliates-program/${url}`, {
          method: 'POST',
          body: JSON.stringify({
            claimRequest: {
              address,
              nonce: reward.nonce,
            },
          }),
        })

        const result = await response.json()
        if (result.status === 'success') {
          await callContract(isAffiliateClaim, result?.claimRequest as ClaimDetail)
        } else {
          toastError(result?.error || '')
        }
      } else {
        await callContract(isAffiliateClaim, reward)
      }
    } catch (error) {
      console.error(`Submit Historical onClick Claim Error: ${error}`)
    }
  }

  const callContract = async (isAffiliateClaim: boolean, reward: ClaimDetail) => {
    try {
      const { nonce, totalCakeSmallUnit, signature } = reward as any
      const claimType = isAffiliateClaim ? 0 : 1
      const expiryTime = Math.floor(new Date(reward.expiryTime ?? 0).getTime() / 1000)

      if (!contract || !contract.account || !address) return

      const receipt = await fetchWithCatchTxError(() =>
        contract.write.claim(
          [
            {
              nonce,
              claimer: address,
              claimType,
              totalAmount: totalCakeSmallUnit,
              expiryTimestamp: BigInt(expiryTime),
            },
            signature,
          ],
          {
            account: contract.account!,
            chain: contract.chain,
          },
        ),
      )

      if (receipt?.status) {
        toastSuccess(
          t('Success!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Funds sent to your wallet')}
          </ToastDescriptionWithTx>,
        )

        if (isAffiliateClaim) {
          await affiliateClaimDataRefresh()
        } else {
          await userClaimDataRefresh()
        }
      }
    } catch (error) {
      console.error(`Submit Historical Claim Reward Error: ${error}`)
    }
  }

  return (
    <Flex flexDirection="column" width="100%">
      {chainId !== ChainId.BSC && <WrongNetworkWarning />}
      <>
        {isAffiliate && (
          <SingleHistoricalReward
            mb="24px"
            title={t('Affiliate Reward')}
            tableFirstTitle={t('Affiliate Reward')}
            isAffiliateClaim
            dataList={affiliateClaimData}
            currentPage={affiliateDataCurrentPage}
            isFetching={affiliateIsFetching}
            setCurrentPage={setAffiliateDataCurrentPage}
            handleClickClaim={handleClickClaim}
          />
        )}
        <SingleHistoricalReward
          title={t('User Reward')}
          tableFirstTitle={t('User Reward')}
          isAffiliateClaim={false}
          dataList={userClaimData}
          currentPage={userDataCurrentPage}
          isFetching={userIsFetching}
          setCurrentPage={setUserDataCurrentPage}
          handleClickClaim={handleClickClaim}
        />
      </>
    </Flex>
  )
}

export default HistoricalReward
