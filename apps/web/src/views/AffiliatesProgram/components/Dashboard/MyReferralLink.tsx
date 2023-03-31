import { useMemo, useState } from 'react'
import {
  Flex,
  Text,
  Input,
  Box,
  Card,
  Button,
  ArrowForwardIcon,
  useMatchBreakpoints,
  useToast,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'
import { useSignMessage } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useDefaultLinkId from 'views/AffiliatesProgram/hooks/useDefaultLinkId'
import commissionList from 'views/AffiliatesProgram/utils/commisionList'
import { InfoDetail } from 'views/AffiliatesProgram/hooks/useAuthAffiliate'

const Wrapper = styled(Flex)`
  padding: 1px;
  width: 100%;
  margin: 46px auto auto auto;
  background: linear-gradient(180deg, #53dee9, #7645d9);
  border-radius: ${({ theme }) => theme.radii.default};

  ${({ theme }) => theme.mediaQueries.md} {
    width: fit-content;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin: auto auto auto 36px;
  }
`

const StyledCommission = styled(Flex)`
  position: relative;
  width: 50%;
  min-width: 84px;
  align-items: center;
  flex-direction: column;
  align-self: center;
  padding: 9px 0;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    height: 60px;
    width: 1px;
    transform: translateY(-50%);
    background-color: ${({ theme }) => theme.colors.inputSecondary};
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 118px;
  }
`

const CardInner = styled(Flex)`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 24px;
  justify-content: space-between;
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.gradientBubblegum};
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;

  ${StyledCommission} {
    &:first-child {
      &:before {
        display: none;
      }
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 297px;
  }
`

interface MyReferralLinkProps {
  affiliate: InfoDetail
  refreshAffiliateInfo: () => void
}

const receivePercentageList: Array<string> = ['0', '25', '50', '75', '100']

const MyReferralLink: React.FC<React.PropsWithChildren<MyReferralLinkProps>> = ({
  affiliate,
  refreshAffiliateInfo,
}) => {
  const { t } = useTranslation()
  const { address, connector } = useAccount()
  const { toastSuccess, toastError } = useToast()
  const { signMessageAsync } = useSignMessage()
  const { defaultLinkId, refresh } = useDefaultLinkId()
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { isMobile } = useMatchBreakpoints()
  const [percentage, setPercentage] = useState('0')

  const youWillReceive = useMemo(() => new BigNumber(100).minus(percentage).toString(), [percentage])

  const dataList = useMemo(() => commissionList.filter((i) => i.percentage !== '?'), [])

  const linkId = useMemo(() => note || defaultLinkId, [note, defaultLinkId])

  const handleGenerateLink = async () => {
    try {
      setIsLoading(true)
      // BSC wallet sign message only accept string
      const message =
        connector?.id === 'bsc'
          ? ethers.utils.solidityKeccak256(
              ['string', 'uint256', 'uint256', 'uint256'],
              [linkId, Number(percentage), Number(percentage), Number(percentage)],
            )
          : ethers.utils.arrayify(
              ethers.utils.solidityKeccak256(
                ['string', 'uint256', 'uint256', 'uint256'],
                [linkId, Number(percentage), Number(percentage), Number(percentage)],
              ),
            )

      const signature = await signMessageAsync({ message })
      const data = {
        fee: {
          linkId,
          signature,
          address,
          v2SwapFee: Number(percentage),
          v3SwapFee: Number(percentage),
          stableSwapFee: Number(percentage),
        },
      }

      const response = await fetch('/api/affiliates-program/affiliate-fee-create', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      const result = await response.json()

      if (result.status === 'success') {
        await Promise.all([refreshAffiliateInfo(), refresh()])
        setNote('')
        toastSuccess(t('Referral Link Created'))
      } else {
        toastError(result.error)
      }
    } catch (error) {
      console.error(`Submit Create Fee Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      width={['100%', '100%', '100%', '100%', '100%', '700px']}
      m={['32px 0 0 0', '32px 0 0 0', '32px 0 0 0', '32px 0 0 0', '32px 0 0 0', '0 0 0 32px']}
    >
      <Card>
        <Box padding={['24px']}>
          <Text bold mb={['17px']} color="secondary" fontSize="12px" textTransform="uppercase">
            {t('create a new link')}
          </Text>
          <Flex mb="24px">
            <Input
              scale="lg"
              maxLength={20}
              value={note}
              type="text"
              placeholder="Note (20 characters)"
              onChange={(e) => setNote(e.target.value)}
            />
          </Flex>
          <Flex flexDirection={['column', 'column', 'column', 'column', 'column', 'row']} mb="36px">
            <Flex alignSelf="center" width={['100%', '320px']} justifyContent={['space-between']}>
              <Box>
                <Text fontSize="14px" color="textSubtle">
                  {t('You will receive')}
                </Text>
                <Text color="secondary" bold fontSize={['32px']} textAlign="center">
                  {`${youWillReceive}%`}
                </Text>
              </Box>
              <ArrowForwardIcon color="textSubtle" style={{ alignSelf: 'center' }} />
              <Box>
                <Text fontSize="14px" color="textSubtle">
                  {t('Friends will receive')}
                </Text>
                <Text color="primary" bold fontSize={['32px']} textAlign="center">
                  {`${percentage}%`}
                </Text>
              </Box>
            </Flex>
            <Wrapper>
              <CardInner>
                {dataList.map((list) => (
                  <>
                    {list.id === 'perpetual' && affiliate.ablePerps ? null : (
                      <StyledCommission key={list.id}>
                        <Flex>
                          <Box>
                            <Text fontSize="12px" textAlign="center" bold color="secondary" textTransform="uppercase">
                              {list.title}
                            </Text>
                            <Text textAlign="center" fontSize={['32px']} bold>
                              {list.percentage}
                            </Text>
                          </Box>
                        </Flex>
                      </StyledCommission>
                    )}
                  </>
                ))}
              </CardInner>
            </Wrapper>
          </Flex>
          <Flex mb={['8px', '8px', '8px', '0']}>
            {receivePercentageList.map((list) => (
              <Button
                scale={isMobile ? 'sm' : 'md'}
                width={`${100 / receivePercentageList.length}%`}
                key={list}
                mr="8px"
                variant={list === percentage ? 'primary' : 'tertiary'}
                onClick={() => setPercentage(list)}
              >
                {`${list}%`}
              </Button>
            ))}
          </Flex>
          <Button mt="24px" width="100%" disabled={isLoading} onClick={handleGenerateLink}>
            {t('Generate a referral link')}
          </Button>
        </Box>
      </Card>
    </Box>
  )
}

export default MyReferralLink
