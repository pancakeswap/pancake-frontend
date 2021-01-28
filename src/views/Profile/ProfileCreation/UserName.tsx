import React, { useState } from 'react'
import { Card, CardBody, Heading, Text, Input, Button } from '@pancakeswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useI18n from 'hooks/useI18n'
import useWeb3 from 'hooks/useWeb3'
import debounce from 'lodash/debounce'
import { useToast } from 'state/hooks'
import { getProfileContract } from 'utils/contractHelpers'
import { getPancakeRabbitsAddress } from 'utils/addressHelpers'
import useProfileCreation from './contexts/hook'

const UserName: React.FC = () => {
  const { teamId, bunnyId, userName, setUserName } = useProfileCreation()
  const TranslateString = useI18n()
  const { account } = useWallet()
  const web3 = useWeb3()
  const { toastError } = useToast()
  const contract = getProfileContract()
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = debounce(async (e) => {
    const { value } = e.target
    const res = await fetch(`${process.env.REACT_APP_API_PROFILE}/api/users/valid?username=${value}`)
    if (res.ok) {
      setIsValid(true)
      setMessage('')
    } else {
      const data = await res.json()
      setIsValid(false)
      setMessage(data?.error?.message)
    }
    setUserName(value)
  }, 200)

  const handleComplete = async () => {
    try {
      setIsLoading(true)
      // Last param is the password, and is null to request a signature in the wallet
      const signature = await web3.eth.personal.sign(userName, account, null)
      const res = await fetch(`${process.env.REACT_APP_API_PROFILE}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: account,
          username: userName,
          signature,
        }),
      })

      if (res.ok) {
        await contract.methods.createProfile(teamId, getPancakeRabbitsAddress(), bunnyId).send({ from: account })
      } else {
        const data = await res.json()
        toastError(data?.error?.message)
      }
    } catch (error) {
      toastError(error?.message ? error.message : JSON.stringify(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {TranslateString(999, `Step ${4}`)}
      </Text>
      <Heading as="h3" size="xl" mb="24px">
        {TranslateString(999, 'Set Your Name')}
      </Heading>
      <Text as="p" mb="24px">
        {TranslateString(
          999,
          'This name will be shown in team leaderboards and search results as long as your profile is active.',
        )}
      </Text>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" size="lg" mb="8px">
            {TranslateString(999, 'Set Your Name')}
          </Heading>
          <Text as="p" color="textSubtle" mb="24px">
            {TranslateString(
              999,
              'Your name must be at least 3 and at most 15 standard letters and numbers long. You can’t change this once you click Confirm.',
            )}
          </Text>
          <Input
            onChange={handleChange}
            isWarning={userName && !isValid}
            isSuccess={userName && isValid}
            minLength={3}
            maxLength={15}
          />
          <Text color="textSubtle" fontSize="14px" mt="4px" style={{ minHeight: '21px' }}>
            {message}
          </Text>
        </CardBody>
      </Card>
      <Button onClick={handleComplete} disabled={!isValid} isLoading={isLoading}>
        {TranslateString(999, 'Complete Profile')}
      </Button>
    </>
  )
}

export default UserName
